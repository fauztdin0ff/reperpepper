		Pace.on('progress', function (progress) {
			var pr = Math.ceil(progress);
			if( pr < 14 ){
				document.querySelector('#preloader > img:nth-child(1)').style.opacity = 1;
			} else if( pr < 28 ){
				document.querySelector('#preloader > img:nth-child(1)').style.opacity = 0;
				document.querySelector('#preloader > img:nth-child(2)').style.opacity = 1;
			}  else if( pr < 42 ){
				document.querySelectorAll('#preloader > img:nth-child(-n+2)').forEach(el => {		el.style.opacity = 0;		});
				document.querySelector('#preloader > img:nth-child(3)').style.opacity = 1;
			}  else if( pr < 56 ){
				document.querySelectorAll('#preloader > img:nth-child(-n+3)').forEach(el => {		el.style.opacity = 0;		});
				document.querySelector('#preloader > img:nth-child(4)').style.opacity = 1;
			} else if( pr < 70 ){
				document.querySelectorAll('#preloader > img:nth-child(-n+4)').forEach(el => {		el.style.opacity = 0;		});
				document.querySelector('#preloader > img:nth-child(5)').style.opacity = 1;
			} else if( pr < 85 ){
				document.querySelectorAll('#preloader > img:nth-child(-n+5)').forEach(el => {		el.style.opacity = 0;		});
				document.querySelector('#preloader > img:nth-child(6)').style.opacity = 1;
			} else if( pr <= 100 ){
				document.querySelectorAll('#preloader > img:nth-child(-n+6)').forEach(el => {		el.style.opacity = 0;		});
				document.querySelector('#preloader > img:nth-child(7)').style.opacity = 1;
			}

			document.querySelector('.pace_progress').innerHTML = pr + '%';
			document.querySelector('.timeBar > span').style.width = pr + '%';
		});
		Pace.on('done', function (progress) {
			document.querySelector('#preloader').style.display = 'none';
			
			document.querySelector('#intro video').play();

			document.querySelectorAll('.to-animate-after-preload').forEach(el => {
				el.classList.add('animate__animated', el.dataset.animation);
			});

			/*
			// some actions only after full load
			$.get("moments.html", function(data) {
				$("#moments").append( data );
			});
			
			let gallery = document.querySelector('#gallery');
			// some actions only after full load
			$.get("gallery.html", function(data) {
				$("#gallery").append( data );
				
				new Swiper(gallery.querySelector('.swiper'), {
						//lazy: true,
						loop: true,
						slidesPerView: 'auto',
						centeredSlides: true,

						navigation: {
							prevEl: gallery.querySelector('.arrows .left'),
							nextEl: gallery.querySelector('.arrows .right'),
						},
						pagination: {
							el: gallery.querySelector('.swiper-pagination'),
							type: 'bullets',
							dynamicBullets: true,
							dynamicMainBullets: 2
						},
						breakpoints: {
							0: {
								spaceBetween: 10,
							},
							599: {
								spaceBetween: 20,
							}
						}
				});
			});
			
			// some actions only after full load
			$.get("vid.html", function(data) {
				$("img.trad_bg").hide();
				$("#vid").prepend( data );
			});

			// some actions only after full load
			$.get("map.html", function(data) {
				$("#mapWrapper").prepend( data );
			});
			*/
		});
	