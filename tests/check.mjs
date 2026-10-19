import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const base=fs.existsSync('dist/index.html')?'dist':'.';
const core=require(path.resolve(base,'core.js'));
const courses=JSON.parse(fs.readFileSync(base+'/data/courses.json','utf8'));
const quiz=JSON.parse(fs.readFileSync(base+'/data/questions/fisica-01.json','utf8'));
assert.equal(courses.length,18);
assert.equal(new Set(courses.map(c=>c.id)).size,18);
for(const c of courses){
  assert.equal(c.topics.length,24,c.name);
  assert.equal(new Set(c.topics.map(t=>t.id)).size,24);
  assert.equal(new Set(c.topics.map(t=>t.title)).size,24);
  c.topics.forEach((t,i)=>{assert.equal(t.id,String(i+1).padStart(2,'0'));assert.ok(t.title.length>3);assert.equal(t.videoUrl,null);assert.equal(t.solutionUrl,null);if(t.questionsFile)assert.ok(fs.existsSync(path.join(base,t.questionsFile)));});
}
assert.ok(core.validateQuestions(quiz.questions));
assert.equal(core.grade(quiz.questions,Object.fromEntries(quiz.questions.map(q=>[q.id,q.correct]))).score,20);
assert.equal(core.grade(quiz.questions,Object.fromEntries(quiz.questions.map(q=>[q.id,(q.correct+1)%5]))).score,0);
assert.equal(core.grade(quiz.questions,Object.fromEntries(quiz.questions.slice(0,5).map(q=>[q.id,q.correct]))).score,10);
assert.equal(core.grade(quiz.questions,{}).answered,0);
assert.ok(!core.validateQuestions(quiz.questions.slice(1)));
assert.ok(!core.validateQuestions(quiz.questions.map(q=>({...q,correct:5}))));
assert.equal(core.normalize('FÍSICA'),'fisica');
for(const url of ['dQw4w9WgXcQ','https://www.youtube.com/watch?v=dQw4w9WgXcQ','https://youtu.be/dQw4w9WgXcQ?t=2','https://www.youtube.com/shorts/dQw4w9WgXcQ','https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'])assert.equal(core.youtubeId(url),'dQw4w9WgXcQ');
for(const url of ['javascript:alert(1)','https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ','https://example.com/watch?v=dQw4w9WgXcQ','http://www.youtube.com/watch?v=dQw4w9WgXcQ','https://www.youtube.com/watch?v=x'])assert.equal(core.youtubeId(url),null);
assert.equal(core.safeUrl('javascript:alert(1)'),null);
assert.equal(core.safeUrl('http://example.com'),null);
assert.equal(core.safeUrl('https://example.com/a.pdf'),'https://example.com/a.pdf');
const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',classList:{add(){},remove(){}},focus(){},scrollIntoView(){}});return elements.get(id);}
const handlers={};
const storage=new Map();
const location={hostname:'example.test',origin:'https://example.test',search:'?preview=1',hash:'#/cursos'};
const sandbox={console,URL,URLSearchParams,Set,Map,Date,Number,document:{baseURI:'https://example.test/',title:'',getElementById:element,addEventListener:(n,f)=>handlers[n]=f,querySelector:()=>({focus(){},scrollIntoView(){}}),activeElement:null},location,sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},localStorage:{setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>1,clearTimeout(){},requestAnimationFrame:f=>f(),fetch:async url=>{const pathname=String(url).replace('https://example.test/','');return {ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(base,pathname),'utf8'))};}};
sandbox.window=sandbox;
sandbox.scrollTo=()=>{};
sandbox.addEventListener=(n,f)=>handlers[n]=f;
vm.createContext(sandbox);
for(const filename of ['config.js','core.js','app.js'])vm.runInContext(fs.readFileSync(base+'/'+filename,'utf8'),sandbox,{filename,timeout:2000});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
await tick();await tick();
const html=()=>element('app').innerHTML;
assert.equal((html().match(/class="course-card"/g)||[]).length,18);
function navigate(hash){location.hash=hash;handlers.hashchange();}
for(const c of courses){
  navigate('#/curso/'+c.id);
  assert.equal((html().match(/class="topic-card"/g)||[]).length,24,c.name);
  for(const t of c.topics){navigate(`#/tema/${c.id}/${t.id}/video`);assert.ok(html().includes('Esta videoclase estará aquí'));assert.ok(html().includes('role="tabpanel"'));}
}
navigate('#/tema/fisica/01/practica');await tick();await tick();
assert.equal((html().match(/class="question /g)||[]).length,10);
const submit=()=>handlers.submit({target:{id:'quiz-form'},preventDefault(){}});
submit();assert.ok(element('toast').textContent.includes('Responde las 10'));
for(const q of quiz.questions)handlers.change({target:{matches:()=>true,name:q.id,value:String(q.correct)}});
submit();assert.ok(html().includes('20<small>/20'));
assert.ok(html().includes('10 de 10 respuestas correctas'));
assert.ok([...storage.keys()].some(k=>k.startsWith('slv1:preview:fisica-01')));
navigate('#/tema/fisica/01/solucionario');assert.equal((html().match(/class="solution-item"/g)||[]).length,10);
navigate('#/tema/algebra/02/practica');assert.ok(html().includes('Tu próxima práctica está en preparación'));
navigate('#/tema/algebra/02/solucionario');assert.ok(html().includes('Pronto tendrás el solucionario'));
navigate('#/tema/unknown/01/video');assert.ok(html().includes('No encontramos este tema'));
navigate('#/cursos');handlers.input({target:{id:'course-search',value:'análisis dimensional'}});assert.equal((element('course-grid').innerHTML.match(/class="course-card"/g)||[]).length,1);
handlers.input({target:{id:'course-search',value:'xyznever'}});assert.ok(element('course-grid').innerHTML.includes('No encontramos coincidencias'));
navigate('#/acceso');assert.ok(html().includes('Continuar con Google'));assert.ok(!html().includes('type="email"'));
const index=fs.readFileSync(base+'/index.html','utf8');
for(const file of ['styles.css','config.js','core.js','app.js','assets/favicon.svg'])assert.ok(index.includes(file)&&fs.existsSync(base+'/'+file));
assert.ok(!fs.readFileSync(base+'/app.js','utf8').includes('firestore'));
console.log('OK: 18 cursos, 432 temas, navegación a cada tema, búsqueda, pestañas, 10 preguntas, notas 0/10/20, solucionario, validación de enlaces y pantalla Google.');
console.log('Límite: no se ejecutó navegador ni inicio de sesión real con Google.');
