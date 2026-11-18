var open=false;
var ready=true;
document.getElementById('toggleNav').addEventListener('click',()=>{ // opening menu
	if(!ready)return;
	open=!open;ready=false;
	if(open==true){
		document.getElementsByClassName('togglable')[0].style.display='inline-block';
		document.getElementById('toggleNav').getElementsByTagName('i')[0].innerHTML='menu_open';
		setTimeout(()=>{document.getElementsByClassName('togglable')[0].style.height='200px';ready=true},10);
	}else if(open==false){
		document.getElementById('toggleNav').getElementsByTagName('i')[0].innerHTML='menu';
		document.getElementsByClassName('togglable')[0].style.height='0px';
		setTimeout(()=>{document.getElementsByClassName('togglable')[0].style.display='none';ready=true},150);
	}
});
document.body.addEventListener('click',e=>{ // close menu when clicking off
	if(e.target.parentNode.getAttribute('id')!='toggleNav' && open==true && e.target.parentNode.getAttribute('class')!='togglable'){
		open=false;
		document.getElementById('toggleNav').getElementsByTagName('i')[0].innerHTML='menu';
		document.getElementsByClassName('togglable')[0].style.height='0px';
		setTimeout(()=>{document.getElementsByClassName('togglable')[0].style.display='none';ready=true},150);
	}
});

Array.from(document.querySelectorAll('.discord-dialog__close-button, .discord-dialog')).forEach(e=>{
	e.addEventListener('click',()=>{
		toggle('.discord-dialog');
	});
});

/*var cip=false
var tmgle=document.getElementById('tmgle');

var togit=(()=>{
	cip=false
	if(ifr.style.display!='none'){
		ifr.style.display='none';
		tmgle.style.display='none';
	}else{
		ifr.style.display='block';	
		tmgle.style.display='block';
	}
});

tmgle.addEventListener('click',togit);

document.addEventListener('keydown',e=>{
	if(e.which==17)cip=true
	else if(e.which==77 && cip)togit();
});*/