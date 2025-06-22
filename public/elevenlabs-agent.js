(function(){
  var container=document.getElementById('elevenlabs-agent-container');
  if(!container)return;
  var widget=document.createElement('div');
  widget.id='elevenlabs-agent-widget';
  widget.style.display='flex';
  widget.style.alignItems='center';
  widget.style.justifyContent='center';
  widget.style.height='100%';
  widget.style.padding='1rem';
  widget.style.background='#fff';
  widget.innerText='ElevenLabs agent is unavailable in this environment.';
  container.appendChild(widget);
})();

