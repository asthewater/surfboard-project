
// отзывы


const findBlockByAlias = alias => {
    return $('.reviews__item').filter((ndx, item) => {
      return $(item).attr("data-linked-with") === alias
    });
  };
  
  $('.interactive-avatar__link').click(e =>{
    e.preventDefault();
  
    const $this = $(e.currentTarget);
    const target = $this.attr('data-open');
    const itemToShow = findBlockByAlias(target);
    const curItem = $this.closest('.reviews-switcher__item');
  
    itemToShow.addClass('active').siblings().removeClass('active');
    curItem.addClass('active').siblings().removeClass('active');
    
  });


// команда


  const openItem = item => {
    const container = item.closest('.team__item');
    const contentBlock = container.find('.team__content');
    const textBlock = contentBlock.find('.team__content-block');
    const reqHeight = textBlock.height();
    
    container.addClass('active');
    contentBlock.height(reqHeight);
    };
    
    const closeEveryItem = container => {
      const items = container.find('.team__content');
      const itemContainer = container.find('.team__item');
    
      itemContainer.removeClass('avtive');
      items.height(0);
    };
    
    $('.team__title').click(e => {
      const $this = $(e.currentTarget);
      const container = $this.closest('.team');
      const elemContainer = $this.closest('.team__item');
    
      if(elemContainer.hasClass('active')) {
        closeEveryItem(container);
      } else {
        closeEveryItem(container);
        openItem($this);
      }
    });


    // map


    let myMap;

    const init = () => {
      myMap = new ymaps.Map('map', {
        center: [55.752004, 37.576133],
        zoom: 15,
        controls:[]
      });
      
      var myPlacemark = new ymaps.Placemark([55.752004, 37.576133], {}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: 'images/marker.svg',
        icon_imagesize: [58, 73],
        iconImageOffset: [-3, -42]
    });

    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable('scrollZoom');

    }
    ymaps.ready(init);


    // модальное окно


  const validateFields = (form, fieldsArray) => {
    fieldsArray.forEach(field => {
      field.removeClass("input-error");
      if (field.val().trim() === "") {
        field.addClass("input-error");
      }
    });
  
    const errorFields = form.find(".input-error");

    return errorFields.length === 0;
  }

$('.form').submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $("#modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        comment: comment.val(),
        phone: phone.val(),
        to: to.val()
      },
      
      error: data => {} 
    });

    request.done(data => {
      content.text(data.message);
      
    });

    request.fail(data =>{
      const message = data.responseJSON.message;
      content.text(massage);
      modal.addClass("error-modal");
    });

    request.always(() => {
      $.fancybox.open({
        src: "#modal",
        type: "inline"
      });
    });
  } 
});

$(".js-close-modal").click(e => {
  e.preventDefault();
  $.fancybox.close();
});


// youtube


let player;
const playerContainer = $(".player");

let eventsInit = () => {
  $(".player__start").click(e => {
    e.preventDefault();

    if (playerContainer.hasClass("paused")) {
      playerContainer.removeClass("paused");
      player.pauseVideo();
    } else {
      playerContainer.addClass("paused");
      player.playVideo();
    } 
  });
  $(".player__playback").click(e => {
    const bar = $(e.currentTarget);
    const clickedPosition = e.originalEvent.layerX;

    console.log(clickedPosition);
  })
};

const formatTime = timeSec => {
  const roundTime = Math.round(timeSec);

  const minutes = addZero(Math.floor(roundTime / 60));
  const seconds = addZero(roundTime - minutes * 60);

  function addZero(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `${minutes} : ${seconds}`;
};

const onPlayerReady = () => {
  let interval;
  const durationSec = player.getDuration();

  $(".player__duration-estimate").text(formatTime(durationSec));

  if (typeof interval != 'undefined') {
    clearInterval(interval);
  }
  interval = setInterval(() => {
    const completedSec = player.getCurrentTime();
    const completedPercent = (completedSec / durationSec) * 100;

    $(".player__playback-button").css({
      left: `${completedPercent}%`
    });
    $(".player__duration-completed").text(formatTime(completedSec));

  }, 1000);
};

function onYouTubeIframeAPIReady() {
  player = new YT.Player("yt-player", {
    height: "392",
    width: "662",
    videoId: "LFDaKUHgK7E",
    events: {
      onReady: onPlayerReady,
      // 'onStateChange': onPlayerStateChange
    },
    playerVars: {
      controls: 0,
      disablekb: 0,
      showinfo: 0,
      rel: 0,
      autoplay: 0,
      modestbranding: 0
    }
  });
}

eventsInit();
    

