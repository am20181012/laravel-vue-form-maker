<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Http\Requests\StoreFormRequest;
use App\Http\Requests\UpdateFormRequest;
use Illuminate\Http\Request;
use App\Http\Resources\FormResource;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

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
        return FormResource::collection(Form::where('user_id', $user->id)->paginate());
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
        return new FormResource($form);
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
}
