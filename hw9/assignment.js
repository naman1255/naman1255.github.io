 var pieces = [
                      {"letter":"A", "value":1,  "amount":9, "remaining":9},
                      {"letter":"B", "value":3,  "amount":2, "remaining":2},
                      {"letter":"C", "value":3,  "amount":2, "remaining":2},
                      {"letter":"D", "value":2,  "amount":4, "remaining":4},
                      {"letter":"E", "value":1,  "amount":12, "remaining":12},
                      {"letter":"F", "value":4,  "amount":2, "remaining":2},
                      {"letter":"G", "value":2,  "amount":3, "remaining":3},
                      {"letter":"H", "value":4,  "amount":2, "remaining":2},
                      {"letter":"I", "value":1,  "amount":9, "remaining":9},
                      {"letter":"J", "value":8,  "amount":1, "remaining":1},
                      {"letter":"K", "value":5,  "amount":1, "remaining":1},
                      {"letter":"L", "value":1,  "amount":4, "remaining":4},
                      {"letter":"M", "value":3,  "amount":2, "remaining":2},
                      {"letter":"N", "value":1,  "amount":6, "remaining":6},
                      {"letter":"O", "value":1,  "amount":8, "remaining":8},
                      {"letter":"P", "value":3,  "amount":2, "remaining":2},
                      {"letter":"Q", "value":10, "amount":1, "remaining":1},
                      {"letter":"R", "value":1,  "amount":6, "remaining":6},
                      {"letter":"S", "value":1,  "amount":4, "remaining":4},
                      {"letter":"T", "value":1,  "amount":6, "remaining":6},
                      {"letter":"U", "value":1,  "amount":4, "remaining":4},
                      {"letter":"V", "value":4,  "amount":2, "remaining":2},
                      {"letter":"W", "value":4,  "amount":2, "remaining":2},
                      {"letter":"X", "value":8,  "amount":1, "remaining":1},
                      {"letter":"Y", "value":4,  "amount":2, "remaining":2},
                      {"letter":"Z", "value":10, "amount":1, "remaining":10},
                      {"letter":" ", "value":0,  "amount":2, "remaining":0}
                    ];
        var word = "";
        var score = 0;
        var totalScore = 0;
        var distributedTiles = [];
        var dict = [];

     $(document).ready(function(){
         $.get( "dict.txt", function( txt ) {
        // Get an array of all the words
        var words = txt.split( "\n" );
             dict = words;
        // And add them as properties to the dictionary lookup
        // This will allow for fast lookups later
       // for ( var i = 0; i < words.length; i++ ) {
       //     dict[ words[i] ] = true;
       // }
    });
         
         
         refreshTiles();

         $("#submitWordBtn").click(function(){
             if( dict.indexOf(word.toLowerCase()) < 0){
                alert("there is no such word in dictionary called '" + word + "'"); 
                 refreshTiles();
             }
             else{
                 totalScore += score;
                 $("#totalScore").text("Total Score : " + totalScore);
                 refreshTiles();
             }
         });  
     });
        
        function resetTiles(){
            refreshTiles();
            totalScore = 0;
            $("#totalScore").text("Total Score : " + totalScore);
        }

        function refreshTiles(){
            $("#scrabbleBoard").empty();
            for(i = 0; i < 15 ; i++){
                 for (j = 0 ; j<15; j++){
                     if(i==j || i+j == 14)
                        ele = "<div row='" + i + "' col='" + j + "' class='tileContainer droppable doubleScore'></div>";
                     else
                         ele = "<div row='" + i + "' col='" + j + "' class='tileContainer droppable'></div>";
                    $("#scrabbleBoard").append($(ele)); 
                 }
             }
            
            $(".droppable").droppable({drop:function(event, ui){
                 if ($(ui.draggable).parent().attr("id") != "tileBoard" )
                     ui.draggable.draggable('option', 'revert', true);
                 else if ($(this).children().length > 0){
                     ui.draggable.draggable('option', 'revert', true);
                 }
                 else{
                     if (distributedTiles.length < 7){
                         if ($(this).next().children().length > 0 || $(this).prev().children().length > 0){
                             dropPiece(ui, this);
                         }
                         else{
                             ui.draggable.draggable('option', 'revert', true);
                         }   
                        return;
                     }   
                  dropPiece(ui, this);     
                 }
             }});
            
            
            $("#tileBoard").empty();
            for(i = distributedTiles.length; distributedTiles.length < 7; i++){
                ltrObj = pieces[getRandomInt(0,26)]
                if (ltrObj.remaining > 0)
                    distributedTiles.push(ltrObj);
            }
            
            $.each(distributedTiles, function(idx, ltr){
                ele = "<div class='piece draggable'>" + ltr.letter + "<sub>" + ltr.value + "</sub></div>";
                $("#tileBoard").append($(ele)); 
            });
            
            $(".draggable").draggable();
            word = "";
            score = 0;
            $("#scrabbleBoard").find(".piece").remove();
            $("#score").text("Score : " + score);
        }

        function dropPiece(ui, ele){
            ui.draggable[0].removeAttribute("style");
             $(ele).css("background","#fff");
             $(ele).append(ui.draggable[0]);
             letter = $(ui.draggable[0]).text().substring(0,1);
             for(i = 0 ; i < distributedTiles.length; i++){
                 if (distributedTiles[i].letter == letter){
                     distributedTiles.splice(i,1);
                     break;
                 }
             }
             if ($(ui.draggable[0]).parent().next().children().length > 0)
                word = letter + word;
             else
                 word += letter;
            
             for(i = 0; i< pieces.length; i++){
                if (letter == pieces[i].letter){
                    if ($(this).hasClass('doubleScore'))
                        score += pieces[i].value * 2;
                    else
                        score += pieces[i].value;
                }
            }
            $("#score").text("Score : " + score);
            console.log(word);
            $("#word").text("Word : " + word);
        }
        
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        function findScore(){
            $.each(Array.from(word), function(idx, char){
                console.log(char);
                for(i = 0; i< pieces.length; i++){
                    if (char == pieces[i].letter){
                        score += pieces[i].value;
                    }
                }
            });
            return score;
        }