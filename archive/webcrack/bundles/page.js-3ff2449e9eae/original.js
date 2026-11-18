var purl = (() => {
		var tmp = location.hostname,
			tmp2 = location.hostname.split('.');
		
		if(tmp2.length == 3){
			tmp = tmp2[1] + '.' + tmp2[2]
		}
		
		return tmp
	})(),
	activeElement = document.body,
	toggle_nav = document.querySelector('.toggleNav'),
	nav_items = document.querySelector('.togglable'),
	nav_icon = toggle_nav.firstChild,
	nav_ready = true,
	nav_open = false,
	navbar = document.querySelector('.nav');

toggle_nav.addEventListener('click', () => { // opening menu
	if(!nav_ready) return;
	nav_open = !nav_open;
	nav_ready = false;
	if(nav_open == true) {
		nav_items.style.display = 'inline-block';
		nav_icon.innerHTML = 'menu_open';
		setTimeout(() => {
			nav_items.style.height = '200px';
			nav_ready = true
		}, 10);
	} else if(nav_open == false) {
		nav_icon.innerHTML = 'menu';
		nav_items.style.height = '0px';
		setTimeout(() => {
			nav_items.style.display = 'none';
			nav_ready = true
		}, 150);
	}
});

document.body.addEventListener('click', e => { // close menu when clicking off the navbar
	activeElement = e.target
	if(navbar.contains(e.target) || !nav_open)return;
	
	nav_open = false;
	nav_icon.innerHTML = 'menu';
	nav_items.style.height = '0px';
	setTimeout(()=>{
		nav_items.style.display = 'none'
		nav_ready = true && console.log(nav_ready)
	}, 150);
});

document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('.cord-button').addEventListener('click', () => {
		document.querySelector('.cord-dialog').className = 'cord-dialog cord-dialog--active'
	});

	document.querySelector('.cord-dialog__close-button').addEventListener('click', () => {
		document.querySelector('.cord-dialog').className = 'cord-dialog'
	});
	
	document.querySelector('.aw').addEventListener('error', err => {
		console.warn('arc.io widget failed to load, using fallback..');
		
		Object.assign(document.body.appendChild(document.createElement('script')), {src: '/widget.js'});
	});
});