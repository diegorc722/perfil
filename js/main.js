(function ($) {
	"use strict";

	// Spinner
	var spinner = function () {
		setTimeout(function () {
			if ($('#spinner').length > 0) {
				$('#spinner').removeClass('show');
			}
		}, 1);
	};
	spinner();
	
	
	// Initiate the wowjs
	new WOW().init();


	// Facts counter
	$('[data-toggle="counter-up"]').counterUp({
		delay: 10,
		time: 2000
	});


	// Typed Initiate
	if ($('.typed-text-output').length == 1) {
		var typed_strings = $('.typed-text').text();
		var typed = new Typed('.typed-text-output', {
			strings: typed_strings.split(', '),
			typeSpeed: 100,
			backSpeed: 20,
			smartBackspace: false,
			loop: true
		});
	}


	// Smooth scrolling to section
	$(".btn-scroll").on('click', function (event) {
		if (this.hash !== "") {
			event.preventDefault();
			
			$('html, body').animate({
				scrollTop: $(this.hash).offset().top - 0
			}, 1500, 'easeInOutExpo');
		}
	});
	
	
	// Skills
	$('.skill').waypoint(function () {
		$('.progress .progress-bar').each(function () {
			$(this).css("width", $(this).attr("aria-valuenow") + '%');
		});
	}, {offset: '80%'});


	// Portfolio isotope and filter
	var portfolioIsotope = $('.portfolio-container').isotope({
		itemSelector: '.portfolio-item',
		layoutMode: 'fitRows'
	});
	$('#portfolio-flters li').on('click', function () {
		$("#portfolio-flters li").removeClass('active');
		$(this).addClass('active');

		portfolioIsotope.isotope({filter: $(this).data('filter')});
	});


	// Testimonials carousel
	$(".testimonial-carousel").owlCarousel({
		autoplay: true,
		smartSpeed: 1500,
		dots: true,
		loop: true,
		items: 1
	});
	
	
	// Back to top button
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('.back-to-top').fadeIn('slow');
		} else {
			$('.back-to-top').fadeOut('slow');
		}
	});
	$('.back-to-top').click(function () {
		$('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
		return false;
	});
})(jQuery);

async function descargarCV() {
    const clave = prompt("Por favor, ingresa la clave para descargar el CV:");
    if (!clave) {
        alert("Debes ingresar una clave.");
        return;
    }

    try {
        // Obtener el archivo encriptado desde GitHub Pages
        const response = await fetch("cv/CV.enc");
        if (!response.ok) throw new Error("No se pudo cargar prueba.enc");

        const encryptedContent = await response.text();

        // Desencriptar a WordArray
        const decrypted = CryptoJS.AES.decrypt(encryptedContent, clave);

        if (!decrypted || decrypted.sigBytes <= 0) {
            throw new Error("La clave es incorrecta o el archivo está corrupto.");
        }

        // Convertir WordArray a ArrayBuffer (binario)
        function wordArrayToArrayBuffer(wordArray) {
            const len = wordArray.sigBytes;
            const u8 = new Uint8Array(len);
            const words = wordArray.words;

            let offset = 0;
            for (let i = 0; i < len; i++) {
                const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
                u8[offset++] = byte;
            }
            return u8.buffer;
        }

        const arrayBuffer = wordArrayToArrayBuffer(decrypted);

        // Crear Blob PDF válido
        const blob = new Blob([arrayBuffer], { type: "application/pdf" });

        // Descargar
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "DiegoReyes_CV.pdf";
        link.click();

    } catch (err) {
        alert("Error: " + err.message);
    }
}

function validarYEnviar(form) {
    const name = form.nombre.value.trim();
    const email = form.correo.value.trim();
    const subject = form.asunto.value.trim();
    const message = form.mensaje.value.trim();

	if (!name) {
		alert("Por favor completa el campo Nombre Completo.");
		form.nombre.focus();
		return false;
	}
	if (!email) {
		alert("Por favor completa el campo Correo Electrónico.");
		form.correo.focus();
		return false;
	}
	 if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Ingresa un Correo Electrónico válido.");
		form.correo.focus();
        return false;
    }
	if (!subject) {
		alert("Por favor completa el campo Asunto.");
		form.asunto.focus();
		return false;
	}
	if (!message) {
		alert("Por favor completa el campo Mensaje.");
		form.mensaje.focus();
		return false;
	}
	setTimeout(() => form.reset(), 1000);
    return true;
}

