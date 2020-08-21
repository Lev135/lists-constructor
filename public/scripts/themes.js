function theme_1(){
    var x = document.getElementsByClassName("main_theme")[0];
    var z = document.getElementsByClassName("first_theme")[0];   
    if(x.value != "choose_theme"){   
        z.style.display = "block";
    }
}
function theme_2(){
    var x = document.getElementsByClassName("first_theme")[0];
    var z = document.getElementsByClassName("second_theme")[0];   
    if(x.value != "choose_theme"){   
        z.style.display = "block";
    }
}
function theme_3(){
    var x = document.getElementsByClassName("second_theme")[0];
    var z = document.getElementsByClassName("third_theme")[0];   
    if(x.value != "choose_theme"){   
        z.style.display = "block";
    }
}
