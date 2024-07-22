import React from "react";
import { FlashcardArray } from "react-quizlet-flashcard";

interface FlashcardsProps {
    cards: Array<any>;
    title: string;
    
}

const Flashcards = ({cards, title}: FlashcardsProps) => {

    return (


        <div className="flex flex-col  justify-center items-center h-screen" >
            <div className="mb-20" >
                {title}
            </div>
      <FlashcardArray cards={cards} 
      frontContentStyle={{
        // backgroundColor: "lightgoldenrodyellow",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
          
          
      }}
      backContentStyle={{
        // backgroundColor: "turquoise",
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",

      }}/>
    </div>
    )

}

export default Flashcards
