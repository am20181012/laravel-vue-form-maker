<?php

namespace App\Http\Controllers;

use App\Http\Resources\FormAnswersResource;
use App\Http\Resources\MainFormResource;
use App\Models\Form;
use App\Models\FormAnswer;
use Illuminate\Http\Request;

class MainController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        //ukupno formi
        $total = Form::query()->where('user_id', $user->id)->count();

        //poslednja napravljena forma
        $latest = Form::query()->where('user_id', $user->id)->latest('created_at')->first();

        //ukupan broj odgovora
        $totalAnswers = FormAnswer::query()
            ->join('forms', 'form_answers.form_id', '=', 'forms.id')
            ->where('forms.user_id', $user->id)
            ->count();

        //poslednjih 5 odgovora
        $latestAnswers = FormAnswer::query()
            ->join('forms', 'form_answers.form_id', '=', 'forms.id')
            ->where('forms.user_id', $user->id)
            ->orderBy('end_date', 'DESC') //==latest('end_date')
            ->limit(5)
            ->getModels('form_answers.*');

        return [
            'totalForms' => $total,
            'latestForm' => $latest ? new MainFormResource($latest) : null,
            'totalAnswers' => $totalAnswers,
            'latest5Answers' => FormAnswersResource::collection($latestAnswers)
        ];
    }
}
