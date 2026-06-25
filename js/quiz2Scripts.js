let quizWrongCount=0;
let numQuestions=0;
let quizRightCount=0;



function initializeQuiz2()
{
    console.log("quiz 2 page");
    attachStyleSheetQuiz2();
  //  callBackendQ2("fetchRecordsList",'',console.log);
    fetchAvailableFiguresForEdit();
}


function attachStyleSheetQuiz2()
{
    let sheetLocation='css/quiz2Styles.css';
    let el=document.createElement('link');
    el.rel='stylesheet';
    el.type='text/css';
    el.href=sheetLocation;
    document.head.appendChild(el);
}

function fetchAvailableFiguresForEdit()
{
    console.log("Fetch available figures for edit");
    callBackendQ2("fetchRecordsList",'',printAvailableFiguresForEdit);
    
}

function printAvailableFiguresForEdit(data)
{
    console.log('printAvailableFiguresForEdit');
    let outputButtons='';
    for(let i=0;i<data.length;i++)
    {
        console.log(data[i]["figure"]);
        outputButtons+=
        `<button onClick="handleFigureButtons('${data[i]["figure"]}')">${data[i]["figure"]}|${data[i]["description"]}</button>`;
    }
    document.getElementById("buttonOutputArea").innerHTML=outputButtons;
}

function handleFigureButtons(data)
{
    console.log(data);
    callBackendQ2("fetchDataAndMetadata",{figure:data},printQuiz);
    
}

function shuffle(array)
{
    for(let i=array.length-1;i>0;i--)
    {
        const j = Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
    return array;
}




function printQuiz(data)
{
    console.log(data["data"]);
    numQuestions=data["data"].length;
    columnA=[...data["data"]];
    columnB=[...data["data"]];
    columnC=[...data["data"]];
    columnD=[...data["data"]];

    shuffle(columnA);
    shuffle(columnB);
    shuffle(columnC);
    shuffle(columnD);
    
    document.getElementById("rightWrongStatus").innerHTML="--:";

    let figure=data["metaData"][0]["figure"]; 
    let chapter=data["metaData"][0]["chapter"]; 
    let description=data["metaData"][0]["description"];
    let value0Label=data["metaData"][0]["value0Label"];
    let value1Label=data["metaData"][0]["value1Label"];
    let value2Label=data["metaData"][0]["value2Label"];
    let value3Label=data["metaData"][0]["value3Label"];
    let numColumns=2;
    if (value2Label.length>0)
    {
        numColumns++;
    }
    if (value3Label.length>0)
    {
        numColumns++;
    }
    console.log('numColumns',numColumns);

   // let dataUuid=data["data"][0]["uuid"];
    console.log(value0Label,value1Label);
    let tableOpener=
    `
        <table id="quizTable"><tbody>
    `;
    let tableCloser=
    `
        </tbody></table>
    `;
    let tableHeaders=
    `
        <tr>
            
            <th>${value0Label}</th>
            <th>${value1Label}</th>
            <th>${value2Label}</th>
            <th>${value3Label}</th>
        </tr>`;
    let tableRows='';
    for (let i=0;i<data["data"].length;i++)
    {
        let value0=data["data"][i]["value0"];
        let value1=data["data"][i]["value1"];
        let value2=data["data"][i]["value2"];
        let value3=data["data"][i]["value3"];
        let dataUuid=data["data"][i]["uuid"];

        let uuidA=columnA[i]["uuid"];
        let valueA=columnA[i]["value0"];

        let uuidB=columnB[i]["uuid"];
        let valueB=columnB[i]["value1"];

        let uuidC=columnC[i]["uuid"];
        let valueC=columnC[i]["value2"];

        let uuidD=columnA[i]["uuid"];
        let valueD=columnC[i]["value3"];
      //  console.log(uuidA,uuidB,uuidC,uuidD);
     //   console.log(valueA,valueB,valueC,valueD);

     tableRows=tableRows+
        `
            <tr>
                
                <td id="${uuidA}c0" class='${uuidA}' onclick="handleSelection('${figure}','${uuidA}',0,${numColumns})">${valueA}</td>
                <td id="${uuidB}c1" class='${uuidB}' onclick="handleSelection('${figure}','${uuidB}',1,${numColumns})">${valueB}</td>
                <td id="${uuidC}c2" class='${uuidC}' onclick="handleSelection('${figure}','${uuidC}',2,${numColumns})">${valueC}</td>
                <td id="${uuidD}c3" class='${uuidD}' onclick="handleSelection('${figure}','${uuidD}',3,${numColumns})">${valueD}</td>
            </tr>
        `;
        /*
        tableRows=tableRows+
        `
            <tr>
                
                <td id="${dataUuid}c0" class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',0,${numColumns})">${value0}</td>
                <td id="${dataUuid}c1" class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',1,${numColumns})">${value1}</td>
                <td id="${dataUuid}c2" class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',2,${numColumns})">${value2}</td>
                <td id="${dataUuid}c3" class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',3,${numColumns})">${value3}</td>
            </tr>
        `;
        */
    }
    let tableContents=tableOpener+tableHeaders+tableRows+tableCloser;
    document.getElementById("quizTableOutput").innerHTML=tableContents;
    quizWrongCount=0;
    quizRightCount=0;
}


////////////////////////////////
let selectionArray=[];
function handleSelection(figure,uuid,column,numColumns)
{
  
    let selection={figure:figure,uuid:uuid,column:column,numColumns:numColumns};
    
   // console.log(selection);
    selectionArray.push(selection);
    checkSelectionArray();
}

function deleteUuidClass(uuid)
{
    let targeted=document.getElementsByClassName(uuid);
 //   console.log('targeted',targeted);
    for(let i=0;i<targeted.length;i++)
    {
        targeted[i].innerHTML='';
    }
}


function isToggle()
{
    let lastElement=selectionArray[selectionArray.length-1];
    let targetedColumn=lastElement["column"];
    let targetedUuid=lastElement["uuid"];
    for(let i=0;i<selectionArray.length-1;i++)
    {
        if (selectionArray[i]["column"]==targetedColumn && selectionArray[i]["uuid"]==targetedUuid)
        {
            return true;
        }
    }
    return false;
}

function checkSelectionArray()
{
   // console.log(selectionArray);
    // handle two of the same column
    let columnsSelection=[0,0,0,0];
    let uuidSelection=[];

    // all entries should have the same number of columns
    let numColumns=selectionArray[0].numColumns;

    // the first uuid in the selection, if the answer is correct they'll all be the same if not, the answer is wrong
    let primeUuid=selectionArray[0].uuid;


   // console.log('prime uuid is',primeUuid);
  //  console.log('num columns is ',numColumns);
    for(let i=0;i<selectionArray.length;i++)
    {
        let column=selectionArray[i]["column"];
        let uuid=selectionArray[i]["uuid"];
        uuidSelection[uuid]=uuidSelection[uuid]?uuidSelection[uuid]+1:1;
        columnsSelection[column]+=1;
    }

    if (columnsSelection.indexOf(2)!= -1 )
    {
        let savedSelection=selectionArray.pop();
        selectionArray.length=[];
        selectionArray.push(savedSelection);
      //  console.log("selection array reset and new choice is ",selectionArray);
    }
    
    if(selectionArray.length==numColumns)
    {
        
     //   console.log("Array is full, ready to submit");
     //   console.log("uuid selection",uuidSelection);
     //   console.log(uuidSelection[primeUuid]==numColumns);
       // console.log(primeUuid);
        if(uuidSelection[primeUuid]==numColumns)
        {
            writeToRightWrong(true);
            selectionArray.length=[];
            deleteUuidClass(primeUuid);
        }
        else 
        {
            writeToRightWrong(false);
            selectionArray.length=[];
        }
    }

    let allTds=document.getElementsByTagName("td");
    
    for(let i=0;i<allTds.length;i++)
    {
        allTds[i].classList.remove('selected');
    }

    for(let i=0;i<selectionArray.length;i++)
    {
        let column=selectionArray[i]["column"];
        let uuid=selectionArray[i]["uuid"];
        let id=uuid+"c"+column;
      //  console.log("id",id);
        const element=document.getElementById(id);
        element.classList.add("selected");
    }
}

function checkAnswersInSelectionArray()
{
    let masterUuid=selectionArray[0]["uuid"];
    for(let i=0;i<selectionArray.length;i++)
    {
        if (selectionArray[i]["uuid"] != masterUuid)
        {
            console.log("WRONG!");
            return false;
        }
    }
    console.log("Correct");
    return true;
}


function writeToRightWrong(correct)
{
    let outputMessage='';
    let tag="--:";
    if(correct)
    {
          outputMessage=tag+"That's right!"
          quizRightCount+=1;
    }
    else 
    {
           outputMessage=tag+"No that's not right";
           quizWrongCount+=1;
           document.getElementById("wrongCount").innerHTML="Wrong Answers:"+quizWrongCount;
    }
    document.getElementById("rightWrongStatus").innerHTML=outputMessage;
    if(quizRightCount==numQuestions)
    {
        
        document.getElementById("rightWrongStatus").innerHTML="The quiz is over! You had "+quizWrongCount+" incorrect tries out of " + numQuestions + " questions";
        selectionArray.length=[];
        quizRightCount=0;
        quizWrongCount=0;
        document.getElementById("quizTableOutput").innerHTML='';
      //  document.getElementById("rightWrongStatus").innerHTML='';
    }
}

function callBackendQ2(inputFunction,parameters,callback)
{
    console.log("callBackend:",inputFunction)
    let fetchTarget='php/quiz2_controller.php';
    let inputPackage={function:inputFunction,params:parameters};
    inputPackage=JSON.stringify(inputPackage);
    fetch(fetchTarget, 
        {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:inputPackage
        }
    )
    .then(response=>response.json())
    .then(data=>callback(data));
}


initializeQuiz2();