<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Http\Requests\StoreFormRequest;
use App\Http\Requests\StorFormAnswerRequest;
use App\Http\Requests\UpdateFormRequest;
use Illuminate\Http\Request;
use App\Http\Resources\FormResource;
use App\Models\FormAnswer;
use App\Models\FormQuestion;
use App\Models\FormQuestionAnswer;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Form::where('user_id', $user->id);

        //echo "pre";

        if ($request['search']) {
            $query = Form::where('user_id', $user->id)->where('title', 'like', '%' . $request['search'] . '%');
        }
        return FormResource::collection($query->paginate(6));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreFormRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreFormRequest $request)
    {
        $data = $request->validated();
        if (isset($data['image'])) {
            //ukoliko imamo sliku cuvamo je i na lokal fajl sistemu
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }
        $form = Form::create($data);

        foreach ($data['questions'] as $q) {
            $q['form_id'] = $form->id;
            $this->createQuestion($q);
        }

        return new FormResource($form);
    }

    public function storeAnswers(Form $form, StorFormAnswerRequest $request)
    {
        $validated = $request->validated();

        $formAnswer = FormAnswer::create([
            'form_id' => $form->id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        foreach ($validated['answers'] as $questionId => $answer) {
            //proveravam da li id pitanja pripada istoj formi na koju korisnik odgovara
            $question = FormQuestion::where(['id' => $questionId, 'form_id' => $form->id])->get();
            if (!$question) {
                return response("Invalid question ID: \"$questionId\"", 400);
            }

            $data = [
                'form_question_id' => $questionId,
                'form_answer_id' => $formAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            $questionAnswer = FormQuestionAnswer::create($data);
        }

        return response("", 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Form  $form
     * @return \Illuminate\Http\Response
     */
    public function show(Form $form, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $form->user_id) {
            return abort(403, 'Unauthorized action.');
        }
        return new FormResource($form);
    }

    public function showForOther(Form $form)
    {
        return new FormResource($form);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateFormRequest  $request
     * @param  \App\Models\Form  $form
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateFormRequest $request, Form $form)
    {
        $data = $request->validated();

        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            //brisanje stare slike
            if ($form->image) {
                $absolutePath = public_path($form->image);
                File::delete($absolutePath);
            }
        }

        $form->update($data);

        //pluck - vraca nam kolekciju ID
        $idFromDb = $form->questions()->pluck('id')->toArray();

        $newId = Arr::pluck($data['questions'], 'id');

        $questionsToDelete = array_diff($idFromDb, $newId);

        $questionsToAdd = array_diff($newId, $idFromDb);

        FormQuestion::destroy($questionsToDelete);

        foreach ($data['questions'] as $q) {
            if (in_array($q['id'], $questionsToAdd)) {
                $q['form_id'] = $form->id;
                $this->createQuestion($q);
            }
        }

        //mapa postojecih pitanja, kljuc je id
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach ($form->questions as $q) {
            if (isset($questionMap[$q->id])) {
                $this->updateQuestion($q, $questionMap[$q->id]);
            }
        }


        return new FormResource($form);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Form  $form
     * @return \Illuminate\Http\Response
     */
    public function destroy(Form $form, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $form->user_id) {
            return abort(403, 'Unauthorized action.');
        }
        $form->delete();

        if ($form->image) {
            $absolutePath = public_path($form->image);
            File::delete($absolutePath);
        }

        return response('', 204);
    }

    private function saveImage($image)
    {
        //1. provera da li je slika validan base64 string, odnosno da li pocinje sa navedenim paternom
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            $image = substr($image, strpos($image, ',') + 1);
            $type = strtolower($type[1]);

            //2. provera da li je tip slike validan
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new Exception('image type error');
            }

            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new Exception('base64_decode error');
            }
        } else {
            throw new Exception('image error');
        }

        //putanja gde cuvamo slike
        $dir = 'images/';

        //ovde se kreira ime fajla koje je neki random string + .ekstenzija
        $file = Str::random() . '.' . $type;

        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;

        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

        return $relativePath;
    }

    private function createQuestion($question)
    {
        if (is_array($question['data'])) {
            $question['data'] = json_encode($question['data']);
        }
        $validator = Validator::make($question, [
            'question' => 'required|string',
            'type' => ['required', Rule::in([
                Form::TYPE_TEXT,
                Form::TYPE_TEXTAREA,
                Form::TYPE_SELECT,
                Form::TYPE_RADIO,
                Form::TYPE_CHECKBOX,
            ])],
            'description' => 'nullable|string',
            'data' => 'present',
            'form_id' => 'exists:App\Models\Form,id'
        ]);

        return FormQuestion::create($validator->validated());
    }

    private function updateQuestion(FormQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\FormQuestion,id',
            'question' => 'required|string',
            'type' => ['required', Rule::in([
                Form::TYPE_TEXT,
                Form::TYPE_TEXTAREA,
                Form::TYPE_SELECT,
                Form::TYPE_RADIO,
                Form::TYPE_CHECKBOX,
            ])],
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        return $question->update($validator->validated());
    }
}
