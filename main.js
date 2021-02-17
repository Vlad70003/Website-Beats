// всплывающее меню секции offers
let offersList = document.querySelector(".offers");
 
offersList.addEventListener("mouseover", function(event) {
    let cursor = $(event.target);
    let findBlock = cursor.children(".settings__list");
    if (findBlock){
        let settingsGear = findBlock.closest(".settings__gear");
        settingsGear.addClass("block");
    }

})
offersList.addEventListener("mouseout", function(event) {
    let cursor = $(event.target);
    let findBlock = cursor.find(".settings__gear");
    findBlock.removeClass("block");
})
    
// всплывающее меню Гамбургер
    let hamburger = document.querySelector(".hamburger");
    let hideMenu = document.querySelector(".hide-menu");
    let hideMenuClose = document.querySelector(".hide-menu__close");

    hamburger.addEventListener("click", function(event){
        if(event){
            hideMenu.style.display = "block";
        }  
    })

    hideMenuClose.addEventListener("click", function(event){
        if(event){
            hideMenu.style.display = "none";
        }
    })

//Всплывающее меню Команда
    let openItem = item => {
        let conteiner = item.closest(".team__item");
        let contentBlock = conteiner.find(".team__hidden-conteiner");
        let textBlock = contentBlock.find(".team__hidden-conteiner__block");
        let reqHeight = textBlock.height();


        conteiner.addClass("active");
        contentBlock.height(reqHeight);
    }

    let closeItem = conteiner => {
        let item = conteiner.find(".team__hidden-conteiner");
        let itemConteiner = conteiner.find(".team__item");

        itemConteiner.removeClass("active");
        item.height(0);
    }

    $(".team__link").click(e => {
        let $this = $(e.currentTarget);
        let conteiner = $this.closest(".team__list");
        let elemConteiner = $this.closest(".team__item");

        if(elemConteiner.hasClass("active")){
            closeItem(conteiner);
        }else {
            closeItem(conteiner);
            openItem($this);
        }


    })


// Отзывы
    let findBlock = (block) => {
        return $(".rewiews__person").filter( (index, item) => {
            return $(item).attr("data-view") == block;
        })
    }


    $('.pagginator__element').on("click", function(e){
        e.preventDefault();

        let click = $(e.currentTarget);
        let dataOpen = click.children(".pagginator__link").attr("data-open");
        let currentBlock = findBlock(dataOpen);
        let currentTarget =  click.closest(".pagginator__element");
        currentBlock.addClass("isActive").siblings().removeClass("isActive");
        currentTarget.addClass("active").siblings().removeClass("active");
    })

    //Слайлер

const slider = $('.offers__list').bxSlider({
    pager: false,
    controls: false,
    slideMargin: 100,
    shrinkItems: true,
});
$(".arrow-left").on("click", e => {
    e.preventDefault();
    slider.goToPrevSlide();
})

$(".arrow-right").on("click", e => {
    e.preventDefault();
    slider.goToNextSlide();
})

    //Цвета
let blockWidth = item => {
    let reqItemWidth = 0;
    let screenWidth = $(window).width();
    let conteiner = item.closest(".colors__list");
    let titleBlocks = conteiner.find(".color__link");
    let titleWidth = titleBlocks.width() * titleBlocks.length;

    let textConteiner = item.find(".colors__hidden-conteiner");
    let paddingLeft = parseInt(textConteiner.css("padding-left"));
    let paddingRight = parseInt(textConteiner.css("padding-right"));

    let isMobile = window.matchMedia("(max-width: 850px)").matches;

    if (isMobile){
        reqItemWidth =  screenWidth - titleWidth;
    }
    else{
        reqItemWidth = 500;
    }

    return {
        conteiner: reqItemWidth,
        textConteiner: reqItemWidth - paddingLeft - paddingRight
    }
    
}

let openHiddenConteiner = conteiner => {
    conteiner.addClass("active");
    let hiddenConteiner = conteiner.find(".colors__hidden-conteiner");
    let reqWidth = blockWidth(conteiner);
    let textBlock = conteiner.find(".colors__hidden-conteiner");

    textBlock.width(reqWidth.textConteiner);
    hiddenConteiner.width(reqWidth.conteiner);
    hiddenConteiner.width(reqWidth);
    hiddenConteiner.css("opacity", "0.8");
    
}
let closeHiddenConteiner = conteiner => {
    let colorsList = conteiner.closest(".colors__list");
    let colorItem = colorsList.find(".color__item");
    colorItem.removeClass("active");
    let hiddenConteiner = colorsList.find(".colors__hidden-conteiner");
    hiddenConteiner.width(0);
    hiddenConteiner.css("opacity", "0");
}

$(".colors__list").on("click", (e) => {
    e.preventDefault();
    let $target = $(e.target);
    let conteiner = $target.closest(".color__item");
    
    if (conteiner.hasClass("active")){      
        closeHiddenConteiner(conteiner);
    }
    else{
        
        closeHiddenConteiner(conteiner);
        openHiddenConteiner(conteiner);
    }
    
})


    //Модальное окно формы

const validateFilds = (form, fieldsArray) => {

fieldsArray.forEach(field => {
    field.removeClass("input-error");
    if (field.val().trim() ===  ""){
        field.addClass("input-error");
}

})

let errorNumber = form.find(".input-error");

return errorNumber.length === 0;
}

$(".form").submit(e => {
e.preventDefault();
    
let form = $(e.currentTarget);
let name = form.find("[name='name']");
let phone = form.find("[name='phone']");
let comment = form.find("[name='comment']");
let to = form.find("[name='to']");
let street = form.find("[name='street']");
let building = form.find("[name='building']");
let housing = form.find("[name='housing']");
let flat = form.find("[name='flat']");
let floor = form.find("[name='floor']");

let modal = $("#modal");
let modalContent = modal.find(".send-complate__title");


const isValid = validateFilds(form, [name, phone, comment, to]);

if(isValid){

    $.ajax({
        url: "https://webdev-api.loftschool.com/sendmail",
        method: "post",
        data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
        street: street.val(),
        building: building.val(),
        housing: housing.val(),
        flat: flat.val(),
        floor: floor.val(),
        },
        success: data => {
            modalContent.text(data.message);
            $.fancybox.open({
                src: "#modal",
                type: "inline"
            })
            jQuery('.form')[0].reset();
        },
        error: data => {
            let message = data.responseJSON.message;
            modalContent.text(message);
            $.fancybox.open({
                src: "#modal",
                type: "inline"
            })
        }
        

    });
}
})

$(".js-button").on("click", e => {
    e.preventDefault();
    $.fancybox.close();
})

// Видео- плеер
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
    $(".player__playback").on("click", (e) => {
        let $bar = $(e.currentTarget);
        let clickPosition = e.originalEvent.layerX;
        let newButtonPositionPer = (clickPosition / $bar.width()) * 100;
        let newBarPositionSec = (player.getDuration() / 100) * newButtonPositionPer;

        $(".player__playback-button").css({
            left: `${newButtonPositionPer}%`
        })

        player.seekTo(newBarPositionSec);
    })
   }


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
    let durationSec = player.getDuration();
    
    $(".player__duration-estimate").text(formatTime(durationSec));

    if (typeof interval !== "undefined") {
        clearInterval(interval);
      }
      
      interval = setInterval(() => {
        const completedSec = player.getCurrentTime();
      
        const complatePersent = (completedSec / durationSec) * 100 ;

        $(".player__playback-button").css({
            left: `${complatePersent}%`
        });

        $(".player__duration-completed").text(formatTime(completedSec));
      }, 1000);
   };

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '390',
    width: '660',
    videoId: 'LXb3EKWsInQ',
    events: {
      onReady: onPlayerReady,
    //   'onStateChange': onPlayerStateChange
    },
    playerVars: {
    controls: 0,
     disablekb: 1,
     showinfo: 0,
     rel: 0,
     autoplay: 0,
     modestbranding: 0
    }
  });
}
eventsInit();

// Yandex map

let myMap;

ymaps.ready(init);


function init(){
    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 11,
        controls: []
    });
    var coords = [
        [55.75, 37.50],
        [55.75, 37.71],
        [55.70, 37.70]
    ];
    var myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: './img/marker.svg',
        iconImageSize: [46, 57],
        iconImageOffset: [-35, -52]
    });
    for (var i = 0; i < coords.length; i++) {
        myCollection.add(new ymaps.Placemark(coords[i]));
    }
    myMap.geoObjects.add(myCollection);

    myMap.behaviors.disable('scrollZoom');
}

// Scrol
let section = $(".section");
let wrapper = $(".wrapper__conteiner");
let inScroll = false;


section.first().addClass("active");


let performTransition = (sectionEq) => {
    if(inScroll == false){
    inScroll = true;

    let position = sectionEq * -100;
    wrapper.css({

        transform: `translateY(${position}%)`
    });

    section.eq(sectionEq).addClass("active").siblings().removeClass("active");

    setTimeout(() => {
        inScroll = false;
    }, 1300)
    }
    
    
}

let scrollViewport = (direction) => {
    let activeSection = section.filter(".active");
    let nextSection = activeSection.next();
    let prevSection = activeSection.prev();

    if(direction == "next" && nextSection.length){
        performTransition(nextSection.index());
    }
    if(direction == "prev" && prevSection.length){
        performTransition(prevSection.index());
    }
}

$(window).on("wheel", e => {
    let deltaY = e.originalEvent.deltaY;

    if(deltaY > 0 ){
        scrollViewport("next");
    }
    if(deltaY < 0){
        scrollViewport("prev");
    }
})

$(window).on("keydown", e => {

    let tagName = e.target.tagName.toLowerCase();

    if(tagName !== "input" && tagName !== "textarea"){
        switch(e.keyCode){
            case 38:
            scrollViewport("prev");
            break;
    
        case 40:
            scrollViewport("next");
            break;
        } 
    }

})

$("[data-scroll-to]").click(e => {
    e.preventDefault();

    let $this = $(e.currentTarget);
    let target = $this.attr("data-scroll-to");
    let reqSection = $(`[data-section-id=${target}]`);

    performTransition(reqSection.index());
})