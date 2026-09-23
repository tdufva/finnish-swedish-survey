const yesNo = ['Ja', 'Nej'];
const grades = ['Årskurs 1-3', 'Årskurs 4-6', 'Årskurs 7-9', 'Gymnasiet', 'Annat'];
const agree = ['Stämmer helt', 'Stämmer ganska bra', 'Stämmer ganska dåligt', 'Stämmer inte alls'];
const importance = ['Mycket stor', 'Ganska stor', 'Ganska liten', 'Ingen'];
const time = ['Ingen tid', 'En liten del', 'En stor del', 'Nästan all tid'];
const q = (id, number, title, type, options, extra = {}) => ({id, number, title, type, options, ...extra});
const matrix = (id, number, title, rows, options) => q(id, number, title, 'matrix', options, {rows});
const planning = 'Hur stor betydelse har följande för hur du planerar din undervisning i bild?';
export const sections = [
 {title: 'Om dig som bildlärare', subtitle: 'Behörighet och erfarenhet', questions: [
 q('Q1',2,'Vilka årskurser är du behörig att undervisa i bild? (möjligt att välja flera)','multi',grades,{other:true}),
 q('Q2',3,'När blev du behörig att undervisa i bild?','text'),
 q('Q3',4,'Ungefär hur många år sammanlagt har du arbetat som lärare i bild?','single',['1-5','6-10','11-15','16-20','21–25','Mer än 25 år']),
 q('Q46',5,'Är du förstelärare?','single',yesNo),
 q('Q7',6,'Är du behörig för undervisning i något annat ämne, utöver bild?','single',['Nej','Ja.']),
 q('Q11',7,'Vilka ämnen utöver bild är du behörig att undervisa i?','text',null,{when:['Q7','Ja.']})
 ]},
 {title:'Din skola och dina elever',subtitle:'Skolmiljö och inställning till bildämnet',questions:[
 q('Q5',8,'Arbetar du på','multi',['Kommunal skola','Friskola']),
 q('Q23',9,'Skolans upptagningsområde ligger i','text'),
 q('Q38',10,'Ligger skolan i ett område som klassas som utsatt eller särskilt utsatt?','single',yesNo),
 q('Q53',11,'Vilka årskurser undervisar du det här läsåret (möjligt att välja flera)','multi',grades,{other:true}),
 q('Q54',12,'Har du någon ämneskollega på skolan du arbetar?','single',yesNo),
 matrix('Q27',13,'Elevernas attityd till skolan',['Det finns en kultur bland eleverna av att skolan är viktig','De flesta elever strävar efter höga betyg'],agree),
 matrix('Q44',14,'Elevers inställning till bildämnet',['Eleverna tycker bildämnet är viktigt','Eleverna tycker bildämnet är roligt','Eleverna vill ha höga betyg i bildämnet'],agree)
 ]},
 {title:'Förutsättningar för undervisningen',subtitle:'Elevgrupper, lokaler och utrustning',questions:[
 q('Q13',15,'Ungefär hur många elever sammanlagt undervisar du i bild detta läsår?','single',['Färre än 100','100-199','200-299','300-399','400–499','500 eller fler']),
 q('Q35',16,'Har du som regel helklasser i bildundervisningen?','single',yesNo),
 q('Q34',17,'Hur stora är dina undervisningsgrupper i genomsnitt?','single',['färre än 10 elever','mellan 10–20 elever','mellan 20–30 elever','fler än 30 elever']),
 q('Q36',18,'Anser du att du har tillgång till den utrustning som behövs för att bedriva en god bildundervisning i enlighet med kursplanen?','single',['Stämmer helt','Stämmer ganska väl','Stämmer ganska dåligt','Stämmer inte alls']),
 q('Q17',19,'Upplever du att de tillgängliga lokalerna är ändamålsenliga för bildundervisning av god kvalitet?','single',['Stämmer helt','Stämmer ganska väl','Stämmer ganska dåligt','Stämmer inte alls']),
 q('Q52',20,'Har alla elever en egen dator eller iPad (1:1)?','multi',['Ja','Nej','bara elever i vissa årskurser (tex åk 7–9)']),
 matrix('Q42',21,'Hur väl stämmer påståendet in på undervisningssituationen?',['Elevgruppernas storlekar hindrar arbete med ett visst material','Elevgruppernas storlekar hindrar eller försvårar vissa arbetsformer (tex att vara utomhus, eller stora arbeten)'],['Stämmer helt','Stämmer till stor del','Stämmer till liten del','Instämmer inte, undervisningens gruppstorlek utgör inget hinder']),
 q('Q19',null,'Har du tillgång till något förlagsutgivet läromedel?','single',yesNo)
 ]},
 {title:'Att planera bildundervisningen',subtitle:'Vad påverkar dina val?',questions:[
 matrix('Q22',23,planning+' (policy - extern kontext)',['Kursplanens syfte','Kursplanens centrala innehåll','Betygskriterierna','De allmänna delarna i läroplanen (tex skolans värdegrund)','Stödmaterial från skolverket (tex kommentarmaterial till kursplanen i bild)'],importance),
 matrix('Q49',24,planning+' (materiell kontext)',['AI-program (tex Chat gpt, Midjourney)','Storleken på undervisningsgruppen','God tillgång på digital utrustning','Schemaläggningen (tex när på dagen, lektionernas längd)'],importance),
 matrix('Q48',25,planning+' (undervisningsmaterial - extern kontext)',['Förlagsutgivna läromedel','Pedagogiskt material från museer','Pedagogiskt material från myndigheter, t.ex. Mediamyndigheten','Instruktionsfilmer såsom tutorials på youtube','Program från UR','Lektionsplanering från olika hemsidor som innehåller detta (exempelvis lektion.se)','Egenproducerat undervisningsmaterial'],importance),
 matrix('Q47',26,planning+' (professionell kultur)',['Ämneskollegor på skolan (delar med sig av planeringar, samplanerar)','Elevernas förväntningar på och önskemål om bildundervisningen','Skolledningens önskemål eller direktiv','Min egen syn på vad som är viktigt i bildämnet','Min egen utbildning/ämneskunskap'],importance)
 ]},
 {title:'Tiden i bildsalen',subtitle:'Aktiviteter under en termin',questions:[
 matrix('Q45',null,'Uppskatta hur stor del av en klass totala lektionstid i bild under en termin som eleverna gör',['bildframställning med traditionella tekniker','digital bildframställning','bildskapande med AI','skriftlig bildanalys av konstbilder','skriftlig bildanalys av andras bilder, t.ex. reklambilder','muntlig bildanalys av andras bilder, t.ex konst och reklambilder','bildanalys av elevernas egna bilder','analyserar bilder från sin visuella kultur','elever dokumenterar sin arbetsprocess','eleverna arbetar utifrån ett förlagsutgivet läromedel','eleverna söker själva upp t.ex. tutorials eller inspiration på internet','du handleder/undervisar elever en och en eller i små grupper'],time),
 matrix('Q28',null,'Uppskatta hur stor del av den totala lektionstiden för en klass i bild under en termin som du gör följande',['Du föreläser/undervisar elever i helklass om bildanalys','Du föreläser/undervisar elever i helklass om bildframställning, tex om olika bildframställningstekniker eller material','Du föreläser/undervisar elever om bildkommunikation','Du föreläser/undervisar eleverna om konsthistoria eller samtidskonst','Du föreläser/undervisar eleverna om andra bilder än konstbilder så som reklam, mediabilder eller annan visuell kultur','Du handleder/undervisar elever en och en eller i små grupper'],['Ingen tid','En liten del','Ungefär hälften','En stor del','Nästan all tid'])
 ]},
 {title:'Bildämnets innehåll och utmaningar',subtitle:'Vad är viktigast att eleverna lär sig?',questions:[
 matrix('Q39',27,'Hur viktigt anser du att det är att eleverna lär sig följande i bildundervisningen:',['färdigheter i bildframställning, såsom teckning, måleri, skulptur','digital bildframställning så som digitalt fotografi, bildredigering, digital teckning','kommunicera budskap i bild','konsthistoria','analysera konstbilder','analysera mediebilder och reklambilder','kritiskt granska visuell kultur och normer i dessa bilder','får kunskap om vårt kulturarv'],['mycket viktigt','ganska viktigt','inte så viktigt','inte viktigt alls']),
 q('Q40',28,'Är det något som inte täcks in av svarsalternativen ovan som du anser är det viktigaste att eleverna lär sig i bildundervisningen?','text'),
 q('Q51',29,'Vad anser du vara den största utmaningen för en likvärdig bildundervisning i Sverige idag?','single',['brist på likvärdig utrustning (tex utrustning för digital bild och/eller konstnärsmaterial)','antal elever i undervisningsgrupperna varierar mellan skolor','att undervisningens innehåll varierar mellan olika lärares klassrum (elever lär sig olika saker beroende på vilken skola de går på)','brist på utbildade bildlärare och /eller fortbildning för bildlärare','brist på ändamålsenliga lokaler'])
 ]},
 {title:'AI och bildskapande',subtitle:'Erfarenheter, möjligheter och framtid',questions:[
 matrix('Q33',30,'I vilken utsträckning håller du med om följande påståenden om elevernas användning av AI för att skapa bilder?',['Det är positivt att AI ger elever fler möjligheter att snabbt skapa bilder de blir nöjda med.','AI är ett kompletterande verktyg för bildskapande som ger nya möjligheter vid sidan av andra bildframställningstekniker.','Användande av AI för bildskapande kommer minska elevernas hantverkskunnande.','Användande av AI för bildskapande kommer minska elevernas egen kreativitet.','AI kommer minska bildämnets relevans.','AI innebär stora risker för människogjorda bilders värde.'],['Instämmer helt','Instämmer i hög grad','Instämmer i låg grad','Instämmer inte alls']),
 q('Q32',31,'Använder du eller planerar du att låta elever använda AI för att skapa bilder?','single',['Ja, regelbundet','Ja, ibland','Nej, men jag planerar att elever ska använda AI under det här läsåret','Nej, jag har inga planer på att låta elever skapa bilder med AI','Jag skulle vilja att eleverna fick framställa bilder med AI men vi har inte tillgång till den tekniska utrustningen som krävs']),
 q('Q56',32,'Har du fortbildat dig i AI och bildframställning?','multi',['Ja, jag har fått fortbildning via skolan','Ja, jag har lärt mig själv, tex genom tutorials och att testa själv','Nej, men jag ska få utbildning genom skolan','Nej, men jag har planer på att börja testa själv','Nej, jag har ingen planerad fortbildning på detta område']),
 q('Q57',33,'Har du stött på utmaningar när det gäller tillgång till teknik eller stöd för att integrera AI i bildundervisningen? (kryssa för alla alternativ som stämmer)','multi',['Brist på nödvändig hårdvara eller mjukvara','Otillräckliga möjligheter till fortbildning eller utbildning','Begränsat stöd från skolledningen eller IT-personal','Budgetbegränsningar för inköp av teknik','Svårigheter att hitta tid för att integrera AI i undervisningen','Bristande intresse från eleverna','Jag har inte stött på några utmaningar'],{exclusive:'Jag har inte stött på några utmaningar'}),
 q('Q58',34,'Hur tror du att AI kan komma att förändra framtiden för bildundervisningen, både på ett positivt och negativt sätt?','text'),
 q('Q29',35,'Finns det något du vill tillägga om AI och bildskapande som du tycker är viktigt, men som enkäten inte har fångat?','text')
 ]}
];
export const questions = sections.flatMap(s => s.questions);
export function cleanAnswers(answers) {
 const clean = {Q24:'Ja'};
 for (const q of questions) {
  if (q.when && answers[q.when[0]] !== q.when[1]) continue;
  const v = answers[q.id];
  if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue;
  if (q.type === 'text') clean[q.id] = String(v).trim().slice(0,5000);
  else if (q.type === 'matrix') { const rows={}; q.rows.forEach((_,i)=> {if(q.options.includes(v[i])) rows[i]=v[i];}); if(Object.keys(rows).length) clean[q.id]=rows; }
  else if (q.type === 'multi') clean[q.id] = v.filter(x => q.options.includes(x));
  else if (q.options.includes(v)) clean[q.id] = v;
  if (q.other && Array.isArray(v) && v.includes('Annat') && answers[q.id+'_other']) clean[q.id+'_other'] = String(answers[q.id+'_other']).trim().slice(0,5000);
 }
 return clean;
}
