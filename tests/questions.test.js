import test from 'node:test';
import assert from 'node:assert/strict';
import {sections, questions, cleanAnswers} from '../docs/questions.js';
test('all meaningful PDF questions are included with original export IDs',()=>{
 assert.equal(sections.length,7);
 assert.equal(questions.length,36);
 assert.equal(new Set(questions.map(q=>q.id)).size,36);
 assert.equal(questions.find(q=>q.id==='Q45').rows.length,12);
 assert.equal(questions.find(q=>q.id==='Q28').rows.length,6);
 assert.equal(questions.filter(q=>q.type==='matrix').reduce((n,q)=>n+q.rows.length,0),60);
});
test('hidden answers, invalid choices and metadata cannot enter the payload',()=>{
 const cleaned=cleanAnswers({Q7:'Nej',Q11:'hidden answer',Q13:'not an option',Q1:['Årskurs 1-3','invalid'],Q1_other:'hidden',email:'private@example.com',Q27:{0:'Stämmer helt',1:'invalid'},Q40:'  Text  '});
 assert.deepEqual(cleaned,{Q24:'Ja',Q1:['Årskurs 1-3'],Q7:'Nej',Q27:{0:'Stämmer helt'},Q40:'Text'});
});
test('conditional and other answers are retained when relevant',()=>{
 const cleaned=cleanAnswers({Q7:'Ja.',Q11:'Historia',Q53:['Annat'],Q53_other:'Extra',Q2:'2006'});
 assert.equal(cleaned.Q11,'Historia');assert.equal(cleaned.Q53_other,'Extra');assert.equal(cleaned.Q2,'2006');
});

import {fiQuestions, fiSections} from '../docs/fi.js';
import {strings} from '../docs/ui.js';
test('Finnish translation covers every question, matrix row, answer and interface string',()=>{
 assert.equal(fiSections.length,sections.length);
 assert.deepEqual(Object.keys(strings.fi).sort(),Object.keys(strings.sv).sort());
 assert.deepEqual(Object.keys(fiQuestions).sort(),questions.map(q=>q.id).sort());
 for(const q of questions){
  const translated=fiQuestions[q.id];assert.ok(translated.title);
  if(q.options)assert.equal(translated.options.length,q.options.length,q.id+' choices');
  if(q.rows)assert.equal(translated.rows.length,q.rows.length,q.id+' rows');
 }
});
