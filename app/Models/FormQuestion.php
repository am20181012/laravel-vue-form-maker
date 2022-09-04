<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormQuestion extends Model
{
    use HasFactory;

    protected $fillable = ['question', 'data', 'type', 'form_id', 'description'];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
