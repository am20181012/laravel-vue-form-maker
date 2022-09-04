<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormQuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['form_question_id', 'form_answer_id', 'answer'];
}
