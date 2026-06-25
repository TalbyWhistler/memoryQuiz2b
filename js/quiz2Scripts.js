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
        `<button onClick="handleFigureButtons('${data[i]["figure"]}')">${data[i]["figure"]}</button>`;
    }
    document.getElementById("buttonOutputArea").innerHTML=outputButtons;
}

function handleFigureButtons(data)
{
    console.log(data);
    callBackendQ2("fetchDataAndMetadata",{figure:data},printQuiz);
    
}




function printQuiz(data)
{
    console.log(data["data"]);
    
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
        tableRows=tableRows+
        `
            <tr>
               
                <td class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',0,${numColumns})">${value0}</td>
               
                <td class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',1,${numColumns})">${value1}</td>
                <td class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',2,${numColumns})">${value2}</td>
                <td class='${dataUuid}' onclick="handleSelection('${figure}','${dataUuid}',3,${numColumns})">${value3}</td>
            </tr>

        `;
    }
    let tableContents=tableOpener+tableHeaders+tableRows+tableCloser;
    document.getElementById("quizTableOutput").innerHTML=tableContents;
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
    console.log('targeted',targeted);
    for(let i=0;i<targeted.length;i++)
    {
        targeted[i].innerHTML='';
    }
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


    console.log('prime uuid is',primeUuid);
    console.log('num columns is ',numColumns);
    for(let i=0;i<selectionArray.length;i++)
    {
        let column=selectionArray[i]["column"];
        let uuid=selectionArray[i]["uuid"];
        uuidSelection[uuid]=uuidSelection[uuid]?uuidSelection[uuid]+1:1;
        columnsSelection[column]+=1;
    }

    if (columnsSelection.indexOf(2)!= -1)
    {
        let savedSelection=selectionArray.pop();
        selectionArray.length=[];
        selectionArray.push(savedSelection);
        console.log("selection array reset and new choice is ",selectionArray);
    }

    if(selectionArray.length==numColumns)
    {
        
        console.log("Array is full, ready to submit");
        console.log("uuid selection",uuidSelection);
        console.log(uuidSelection[primeUuid]==numColumns);
       // console.log(primeUuid);
        if(uuidSelection[primeUuid]==numColumns)
        {
            console.log("And the answer is correct");
            selectionArray.length=[];
            deleteUuidClass(primeUuid);
        }
        else 
        {
            console.log("But the answer is wrong");
            selectionArray.length=[];
        }
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