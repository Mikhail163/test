/*
    Выполнение тестового задания
    Автор: Уваров Михаил
    Дата начала ппроекта: 30.11.2016
*/

var mJsonData = null;
/*
    mId[0] - значение 0, показываем все департменты
                      1, показываем всех сотрудников в отделе
                      2, показываем карточку сотрудника
                      3, происходит загрузка данных

    mId[1] - id элемента, который будем отображать
*/
var mId; // показывает, что отображать пользователю
var mDepartmentName = '';
var mEmployerName = '';
var mDepartmentQuantity = '';
var mDepartmentNumber = 0;
var mContentArray;
var mPhoto;

var mReactObj;
var mCurrentLink = '';

function init_object(react_obj)
{
    mReactObj = react_obj;
    mId = [0,0];
    getJsonData();
   

    // устанавливаем событие изменения ссылки
    if ('onhashchange' in window) // Если событие поддерживается браузером
    {
        addEventListener('hashchange', check_link); // устанавливаем событие на функцию hash_update
    } 
    else 
    {
        checkInterval = setInterval(check_link, 200); // если не поддерживается, то проверяем на изменение хэша каждые 200 млсек.
    }

} 

function getJsonData()
{
    /*
    if (window.localStorage) 
    {
        //объект localtorage поддерживаются
        mJsonData = window.localStorage.getItem("_mJsonObject");
    }*/

    

    if(mJsonData === null && typeof mJsonData === "object")
    {
        var url = window.location.pathname+'data.json';
        //console.log(url);
        mId[0] = 3; // ставим флаг загрузки данных  
        ajaxGetJsonData(url);
         
    }
    else
        saveJsonData();
        
}

function ajaxGetJsonData(url) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //console.log('responseText:' + xmlhttp.responseText);
            try {
                mJsonData = xmlhttp.responseText;
                saveJsonData();             
                
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
        }
    };
 
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}


function saveJsonData()
{
    //console.log(data);
    if(window.localStorage) {
        window.localStorage.setItem("_mJsonObject", mJsonData);
    } 
    else 
    {
        // надо думать куда сохранять файл
    }

    mId[0] = 0; // данные загружены - оповещаем react
    unserializeJsonData();

    check_link(1);
    //mContentArray = getContentArray(); 
    //rebildLink();

    mContentArray = getContentArray(); 
    mReactObj.departmentsClick();     
}

function unserializeJsonData() {

    if (mId[0] == 3)
    {
        // данные еще загружаются
        return 0;
    }

    // Проверка файла на правильность
    if (!(mJsonData === null && typeof mJsonData === "object"))
    {
        mJsonData = JSON.parse(mJsonData);
        /*if (mJsonData.indexOf( 'employees' ) != -1 ||
            mJsonData.indexOf( 'departments' ) != -1 ||
            mJsonData.indexOf( 'photos' ) != -1) 
            {
                alert("Файд data.json поврежден - процесс загрузки прекращен!");
                throw "stop";
            }
        else*/
        {
            var index;
            var departments_len = mJsonData["departments"].length;
            var employees_count = 0;
            var employees_len = mJsonData["employees"].length;

            for (index = 0; index < departments_len; index++) {
                for (j = 0; j<employees_len; j++)
                    if (mJsonData["employees"][j]["department"] == mJsonData["departments"][index]["id"])
                        employees_count++;
                mJsonData["departments"][index]["employees_count"] = employeesCount(employees_count);
                employees_count = 0;
            }
        }
    }
    
}

function employeesCount(count)
{
    var string = '';
	
	switch(count%10)
		{
			case 0:
			case 5:
			case 6: 
			case 7:
			case 8:
			case 11:
			case 9: string = count +' сотрудников'; break;
		 
			case 1: string = count +' сотрудник'; break;
		 
			case 2:
			case 4:
			case 3: string = count +' сотрудника'; break;
		}

    return string;
}
 
function processEvent(event)
{
    //console.log(event);
    if (event == undefined)
    {
        if (mJsonData != null)
            // cj,snbt
        // сюда обычно попадают во время загрузки файла
        return [0];
    }
    // возвращает массив из двух элементов

    /*
    mId[0] - значение 0, показываем все департменты
                             1, показываем всех сотрудников в отделе
                             2, показываем карточку сотрудника

    mId[1] - id элемента, который будем отображать
    */
    // узнаем какой элемент нам позвонил;
    var id = event['target']['id'];

    id = id.split('_');

    var who = id[0];
    id = id[1];

    

    if (who == "dep")
    {
        // показываем всех работников отдела
        mId[0] = 1;
        var index;
        var departments_len = mJsonData["departments"].length;

        for (index = 0; index < departments_len; index++) { 
            if (mJsonData["departments"][index]["id"] == id)  
            {     
                mDepartmentQuantity = mJsonData["departments"][index]["employees_count"];
                mDepartmentName = mJsonData["departments"][index]["name"];
                break;
            }
        }
    }
    else if (who == "empl")
    {
        mId[0] = 2;

        var index;
        var departments_len = mJsonData["departments"].length;
        var employees_count = 0;
        var employees_len = mJsonData["employees"].length;

        for (j = 0; j<employees_len; j++)
            if (mJsonData["employees"][j]["id"] == id)
            {
                mEmployerName = mJsonData["employees"][j]["name"];

                for (index = 0; index < departments_len; index++) { 
                    if (mJsonData["departments"][index]["id"] == mJsonData["employees"][j]["department"])  
                    {     
                        mDepartmentQuantity = mJsonData["departments"][index]["employees_count"];
                        mDepartmentName = mJsonData["departments"][index]["name"];
                        mDepartmentNumber = mJsonData["employees"][j]["department"];
                        break;
                    }
                }
                var k;
                var photos_quantity = mJsonData["photos"].length;

                for (k = 0; k < photos_quantity; k++) { 
                    if (mJsonData["photos"][k]["id"] == mJsonData["employees"][j]["photo"])  
                    {     
                        mPhoto = mJsonData["photos"][k]["data"];
                        break;
                    }
                }

                break;
            }

    }
    else
        mId[0] = 0;

    mId[1] = id;

    mContentArray = getContentArray();
    rebildLink();
}

function getContentArray()
{
    if (mId[0] == 0)
    {
        return mJsonData["departments"];
    }
    else if (mId[0] == 1)
    {
        return mJsonData["employees"].filter(function(el) {
            return el.department == mId[1];
        });
    }
    else if (mId[0] == 2)
    {
        return mJsonData["employees"].filter(function(el) {
            return el.id == mId[1];
        });
    }
    else return 0;
}

/*
Метод преобразовывает текущую ссылку
*/
function rebildLink()
{
    link = '/departments';

    if (mId[0] == 1)
    {
        link += '/' + mId[1] + '/employees';
    }
    else if (mId[0] == 2)
    {
        link = '/employees/'+mId[1];
    }

    if (link != mCurrentLink)
    {
        window.location.hash = link;
        mCurrentLink = link;
    }
}

/*
проверяем правильность и корректность ссылки
если не правильно - то переадресуем на главную
*/

function check_link()
{
    /* Все возможные структуры ссылок
    /departments
    /departments/{id}/employees
    /employees/{id} 
    */

    var link = window.location.hash;    

    // удаляем символ # из строки
    link = link.substr(1);
    
    var id = ['main',0];

    //удаляем ненужный символ. если он есть
    if (link.slice(-1) == '/')
        link = link.substring(0, link.length - 1);

        //console.log(link);

    if (link == '/departments')
        id[0]='main';
    else
    {
        var separator1 = "/employees/";
        var s1_l = separator1.length;
        var separator2 = "/departments/";
        var s2_l = separator2.length;
        var separator3 = "/employees";
        var s3_l = separator3.length;
        if (link.indexOf(separator1) != -1)
        {
            // Страница персональных данных сотрудника
            id[0]='empl';
            id[1] = link.substring(s1_l, link.length);

            // проверяем, есть ли такой сотрудник
            if (!mJsonData["employees"].some(function(employer) {
                return employer["id"] == id[1];
            }))
            {
                // сотрудник не найден
                id[0]='main';
                id[1] = 0;
            }
        }
        else if ((link.indexOf(separator2) != -1) && (link.indexOf(separator3) != -1))
        {
            // Перечень сотрудников в отделе
            id[0]='dep';
            id[1] = link.substring(s2_l, link.length - s3_l);

            // проверяем, есть ли такой отдел
            if (!mJsonData["departments"].some(function(dep) {
                return dep["id"] == id[1];
            }))
            {
                // отдел не найден
                id[0]='main';
                id[1] = 0;
            }
        }
        else
        {
            // Это непонятная страница - перенаправляем на главную
            id[0]='main';
        }

    }


    if (mId[0] != id[0] || mId[1] != id[1])
    {
        var event = [];
        event['target'] = []
        event['target']['id'] = id[0] +'_'+id[1];
        
        if (arguments.length == 1 && arguments[0] == 1)
            // Метод вызван во время инициализации
            // setState еще вызывать нельзя,
            // поэтому отсылаем два аргумента
            mReactObj.departmentsClick(event);
        else
            mReactObj.departmentsClick(event); 
    }

    
   
}
