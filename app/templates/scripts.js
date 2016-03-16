$(document).ready(function() {
	var $mobileMenu = $('.mobilemenu'),
		$nav = $('.navigation'),
		$header_height = $('.header').outerHeight();
		$navLinks = $('.scroll_to'),
		$sections = $('.section');

		$(window).resize(function () {
		    showMenu();
		    hideMenu();
		});
	/*!
	 * ------------------------------------------------------------------------------------------------------------------------
	 * scroll to the anchors when clicked
	 * ------------------------------------------------------------------------------------------------------------------------	
	 */
	$nav.find('a').click(scrollToSection);

	/*!
	 * ------------------------------------------------------------------------------------------------------------------------
	 * toggle active nav-item when schrolling
	 * ------------------------------------------------------------------------------------------------------------------------	
	 */
	
	$(window).on('scroll', changeActiveNav);


  

    /*!
     * ------------------------------------------------------------------------------------------------------------------------
     * scroll back to the top
     * ------------------------------------------------------------------------------------------------------------------------	
     */

    var offset = 500,
		offset_opacity = 1500,
		scroll_top_duration = 700,
		$back_to_top = $('.scroll_to_top');

     //show button when scrolling
     $(window).scroll(function() {
     	hideMenu();
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('is-visible') : $back_to_top.removeClass('is-visible fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('fade-out');
		}
	})
   
	$('.scroll_to_top, h1').click(scrollToTop);



	/*!
	 * ------------------------------------------------------------------------------------------------------------------------
	 * toggle answers/questions
	 * ------------------------------------------------------------------------------------------------------------------------	
	 */
    var $allQuestions = $('.accordion .answer').addClass('is-hidden');

	$('.accordion .question').click(switch_answers);

	/*!
	 * ------------------------------------------------------------------------------------------------------------------------
	 * mobile menu toggle
	 * ------------------------------------------------------------------------------------------------------------------------	
	 */
	$mobileMenu.click(toggleMenu); //clicking the button

	//slide the menu up when anything is clicked
	$('.main-content').click(hideMenu);

	/*!
	 * ------------------------------------------------------------------------------------------------------------------------
	 * Functions
	 * ------------------------------------------------------------------------------------------------------------------------	
	 */
	function toggleMenu(event) {
		event.preventDefault();
		$nav.slideToggle('300').toggleClass('active');
	}
	function hideMenu() {
		var checkIfMobile = ($(window).width() <= 768 ) ? $nav.slideUp('300').removeClass('active') : false;
	}

	function showMenu() {
		var checkIfMobile = ($(window).width() > 768 ) ? $nav.slideDown('300').addClass('active') : false;
	}


	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.scroll_to').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));

	        if (refElement.position().top - 540 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.scroll_to').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	        
	    });
	};

	function scrollToSection() {
		hideMenu();
		var $el = $(this)
	    , id = $el.attr('href');
		$navLinks.removeClass('active');

		$('html, body').animate({
			scrollTop: $(id).offset().top - $header_height
		}, 800);

		$el.addClass('active');
	  
	  return false;
	}

	function changeActiveNav() {
		var $cur_pos = $(this).scrollTop();
		$sections.each(function() {
		  var $top = $(this).offset().top - $header_height,
		      $bottom = $top + $(this).outerHeight();
		  
		  if ($cur_pos >= $top - 1 && $cur_pos <= $bottom) {
		    $nav.find('a').removeClass('active');
		    $sections.removeClass('active');
		    
		    $(this).addClass('active');
		    $nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
		  }
		});
	}

	function scrollToTop() {
		var scrollTop = parseInt($(window).scrollTop());
		if ( scrollTop > 200 ) {
			$('html, body').animate({scrollTop: 0}, 800);
				return false;
		}
	}


	function switch_answers() {
		$this = $(this);
		$target = $this.parent().next().slideToggle('300').toggleClass('is-hidden');
		$icon = $this.find('.icon').toggleClass('icon-key_down icon-key_up');
		return false;
	}

});


