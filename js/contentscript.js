var curr_ev = null
var prev_x = -5
var prev_y = -5
var fr_x = 0
var to_x = 0
 
$("body").append("<div id = \"apertium-popup-translate\" class = \"apertium-popup-translate\"> <div id = \"apertium-popup-translate-text\" class = \"apertium-popup-translate-text\"> </div>")   

function real_movement(prex, prey, postx, posty) {
    if (Math.sqrt(Math.pow(prex-postx, 2) + Math.pow(prey-posty, 2)) >= 10) {
        return true;
    }
    return false;
}

$(document).mousemove(function(event) {
    if ((curr_ev) && (real_movement(prev_x, prev_y, event.pageX - window.pageXOffset, curr_ev.pageY - window.pageYOffset))) {
        $(".apertium-popup-translate").css("display","none")
    }
    curr_ev = event
});

$(document).mousestop(function() {
    if (curr_ev) {

        var elem = $(document.elementFromPoint((curr_ev.pageX - window.pageXOffset), curr_ev.pageY - window.pageYOffset));
            
        var nodes = elem.contents().filter(function(){
            return this.nodeType == Node.TEXT_NODE && !($(this).text().match(/\A\s*\z/))
        });

        $(nodes).wrap('<apertiumnode />');

        if (nodes.length == 0) {
            $(nodes).unwrap();
        } else {            
            var text = document.elementFromPoint((curr_ev.pageX - window.pageXOffset), curr_ev.pageY - window.pageYOffset);
            if (text.nodeName == 'APERTIUMNODE') { 
                $(nodes).unwrap();
                
                var txt = document.elementFromPoint((curr_ev.pageX - window.pageXOffset), curr_ev.pageY - window.pageYOffset);
                var orig_text = $(txt).html();
                var words = $(txt).text().split(/([ -])/g)
                                
                $(txt).empty()
                $.each(words, function(inx, atext) {
                    $(txt).append("<apertiumword>" + atext + "</apertiumword>");
                });

                
                
                
                $(".apertium-popup-translate-text").empty()
                
                var disp_txt = $(document.elementFromPoint((curr_ev.pageX - window.pageXOffset), curr_ev.pageY - window.pageYOffset)).text()
                
                disp_txt = XRegExp.replace(disp_txt, new XRegExp("\\P{L}+", "g"), "")
                                
                console.log(disp_txt)
                if(disp_txt != "") {
                    $(".apertium-popup-translate-text").append(disp_txt)
                    $(".apertium-popup-translate").css("display","table")
                    var y_offset = 15
                    if ((curr_ev.pageY + 30) > $(window).height()) {
                        y_offset = -40
                    }
                    
                    var x_offset = 20
                    
                    if ((curr_ev.pageX + 40) > $(window).width()) {
                        x_offset = -60
                    }
                    $(".apertium-popup-translate").css("left",((curr_ev.pageX + x_offset).toString() + "px"))
                    
                    $(".apertium-popup-translate").css("top",((curr_ev.pageY + y_offset).toString() + "px"))
                }
                
                prev_x = curr_ev.pageX - window.pageXOffset
                prev_y = curr_ev.pageY - window.pageYOffset
                
                $(txt).empty()
                $(txt).append(orig_text)                                
            } else {
                $(nodes).unwrap();                
            }
        }   
    }
});
