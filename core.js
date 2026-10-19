(function(root){
  'use strict';
  const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  function youtubeId(value){
    if(!value)return null;
    if(/^[\w-]{11}$/.test(value))return value;
    try{
      const u=new URL(value);
      if(u.protocol!=='https:')return null;
      let id=null;
      if(['youtu.be','www.youtu.be'].includes(u.hostname))id=u.pathname.split('/')[1];
      else if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(u.hostname)){
        id=u.searchParams.get('v')||u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      }
      return /^[\w-]{11}$/.test(id||'')?id:null;
    }catch{return null;}
  }
  function validateQuestions(questions){
    return Array.isArray(questions)&&questions.length===10&&new Set(questions.map(q=>q.id)).size===10&&questions.every(q=>typeof q.id==='string'&&typeof q.prompt==='string'&&q.prompt.trim()&&Array.isArray(q.options)&&q.options.length===5&&q.options.every(o=>typeof o==='string'&&o.trim())&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<5);
  }
  function grade(questions,answers){
    if(!validateQuestions(questions))throw new Error('La autoevaluación requiere exactamente 10 preguntas válidas de cinco alternativas.');
    const correct=questions.filter(q=>answers[q.id]===q.correct).length;
    const answered=questions.filter(q=>Number.isInteger(answers[q.id])&&answers[q.id]>=0&&answers[q.id]<5).length;
    return {correct,total:questions.length,answered,score:correct*2};
  }
  function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}}
  const api={normalize,youtubeId,validateQuestions,grade,safeUrl};
  if(typeof module!=='undefined')module.exports=api;
  root.SinLimitesCore=api;
})(typeof window==='undefined'?globalThis:window);
