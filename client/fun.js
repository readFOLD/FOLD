var handpickedStories = [
  "/read/riascience/fifty-years-of-walking-in-space-and-what-we-found-there-uRTtQWQo",
  "/read/FOLD/how-close-are-we-to-the-martian-Bret9g44",
  "/read/BDatta/this-is-not-a-hologram-w5hosSJa",
  "/read/twelvefifths/reaction-diffusion-systems-rvJzfQ6k",
  "/read/kimsmith/automating-creativity-n5E8qJeF",
  "/read/CorySchmitz/how-i-make-textures-kLiQK8se",
  "/read/trainbabie/what-is-hipsterdom-nqeiz7XP",
  "/read/HannahRajnicek/friday-the-13th-in-chicago-superstitions-tattoo-culture-MoEmXgMM",
  "/read/timdunlop/the-first-time-ever-i-saw-your-face-apFj8gt9",
  "/read/smwat/dada-data-and-the-internet-of-paternalistic-things-TsZQXLjK",
  "/read/SproutsIO/finding-flavor-2Pf475CJ",
  "/read/aminobiotech/why-you-should-grow-your-own-bacteria-at-home-JodcMMXB",
  "/read/APCollector/on-a-mans-modular-synth-iRaJbfjY",
  "/read/EthanZ/choosing-the-appropriate-extreme-metal-music-to-listen-to-while-grading-masters-theses-SESbL2qK",
  "/read/CorySchmitz/how-i-make-halftones-nmQRSPe5",
  "/read/manuelaristaran/digital-public-services-user-experience-matters-WwpPfdJq",
  "/read/sammireinstein/it-is-what-it-is-conversations-about-iraq-WotpdjNa",
  "/read/AnnieHuang/shepard-faireys-obey-NnmADS2Z",
  "/read/JanineKwoh/why-diversity-matters-in-the-card-aisle-cR9WaHQe",
  "/read/cesifoti/three-women-scholars-you-should-know-but-you-probably-dont-evYYD35C",
  "/read/Jeremy/proof-of-work-20-He8cm2WC",
  "/read/sgenner/why-screens-can-ruin-your-sleep-XuiGfrJi",
  "/read/sultanalqassemi/sultan-al-qassemi-on-mit-media-lab-imagination-realized-i8ZS3Dtg",
  "/read/MattCarroll/mr-spock-to-the-rescue-how-a-star-trek-star-earned-the-admiration-of-a-young-fan-v5Rr3gGf"
];

var handpickedPeople = [
  "/profile/twelvefifths",
  "/profile/FOLD",
  "/profile/alexishope",
  "/profile/EthanZ",
  "/profile/Rochelle",
  "/profile/jbobrow",
  "/profile/DestinyInFocus",
  "/profile/SproutsIO",
  "/profile/Cristian_jf",
  "/profile/cjaffe",
  "/profile/mpetitchou",
  "/profile/tor",
  "/profile/JanineKwoh",
  "/profile/trainbabie",
  "/profile/CorySchmitz",
  "/profile/MattCarroll",
  "/profile/HannahRajnicek",
  "/profile/delong",
  "/profile/aminobiotech",
  "/profile/cesifoti",
  "/profile/jovialjoy",
  "/profile/shailin",
  "/profile/sannabh",
  "/profile/sgenner",
  "/profile/BDatta",
  "/profile/smwat",
  "/profile/APCollector",
  "/profile/MikeMoschella"
];


Template.random_story.onCreated(function(){
  this.options = handpickedStories;
});

Template.random_person.onCreated(function(){
  this.options = handpickedPeople;
});


_.each(['random_story', 'random_person'], function(templateName){
  Template[templateName].onCreated(function() {
    this.randomizedLink = new ReactiveVar();
    this.rolling = new ReactiveVar();
  });

  Template[templateName].onRendered(function(){
    var that = this;

    this.autorun(function(){
      var currentUrl = Router.current().url;
      that.links = _.reject(that.options, function(url){
        return _s.include(url, idFromPathSegment(currentUrl));
      });

      that.randomizedLink.set(_.sample(that.links));
    });

    this.rollTheDice = function(cb) {
      that.rolling.set(true);
      //var keepRolling = Meteor.setInterval(function(){
      //  that.randomizedLink.set(_.sample(that.links));
      //}, 50);
      Meteor.setTimeout(function(){
        //clearInterval(keepRolling);
        that.rolling.set(false);
        if(cb){
          cb();
        }
      }, 1100);
    }
  });

  Template[templateName].helpers({
    rolling (){
      return Template.instance().rolling.get();
    },
    randomizedLink (){
      return Template.instance().randomizedLink.get();
    }
  });

  Template[templateName].events({
    'click' (e, t){
      e.preventDefault();
      t.rollTheDice(function(){
        Router.go(t.randomizedLink.get());
      })
      trackEvent('Click random story button');
    }
  });
})


