// Список копонентов (from components.js)
const components = {
    enter: enter,
    overlay: overlay,
    summary: Summary,
    exchange : Exchange,
    navbar: NavBar,
    content: Content
}

// Список роутов (from pages.js)
const routes = {
    income: IncomePage,
    outcome: OutcomePage,
    dayInfo: DayPage,
    monthInfo: MonthPage,
    yearInfo: YearPage,
    settings: SettingsPage
  };

  /* ----- spa init module --- */
const mySPA = (function() {

    /* ------- begin view -------- */
    function ModuleView() {
      let myModuleContainer = null;
      let myModuleController = null;
      let menu = null;
      let contentContainer = null;
      let routesObj = null;
  
      this.init = function(container, controller, routes) {
        myModuleContainer = container;
        myModuleController = controller;
        routesObj = routes;
        menu = myModuleContainer.querySelector("#mainmenu");
        contentContainer = myModuleContainer.querySelector("#content");
      }
  
      this.renderContent = function(hashPageName) {// отрисовываем страницу при клике на пункт меню
        let routeName = "income";
  
        if (hashPageName.length > 0) {
          routeName = hashPageName;
        }

        window.document.title = routesObj[routeName].title;
        contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`);
        this.updateButtons(routesObj[routeName].id);
      }
  
       this.updateButtons = function(currentPage) {// меняем классы пунктов меню при переключении
        const menuLinks = menu.querySelectorAll(".mainmenu__link");
  
        for (let i = 0, menuLinksCount = menuLinks.length; i < menuLinksCount; i++) {
          if (currentPage === menuLinks[i].getAttribute("href").slice(1)){
            menuLinks[i].classList.add("active");
          } else {
            menuLinks[i].classList.remove("active");
          }
        }
      }

      this.enterUser= function(p){// показываем всплывающее окно при нажатии на кнопку "Войти", вешаем слушатели на модальное окно
        let overlay = document.querySelector('.overlay'),
            error = document.querySelector('.error');
        overlay.classList.remove('closed');
        error.innerHTML = p;
        document.querySelector('.ok').addEventListener('click', ()=> {
          myModuleController.registerUser()
        });
        document.querySelector('.cancel').addEventListener('click', ()=> overlay.classList.add('closed'))
      }

      this.showError = function(p) { // показываем всплывающее окно при ошибках
        let overlay = document.querySelector('.overlay'),
            error = document.querySelector('.error');
        overlay.classList.remove('closed');
        error.innerHTML = `${p}<button class="ok" title="OK">OK</button>`;
        document.querySelector('.error .ok').addEventListener('click', ()=> overlay.classList.add('closed'));
      }

      this.showAddCategory = function(p) {// показываем всплывающее окно при нажатии на кнопку "Добавить категорию", вешаем слушатели на модальное окно
        let overlay = document.querySelector('.overlay'),
            error = document.querySelector('.error');
        overlay.classList.remove('closed');
        error.innerHTML = p;
        document.querySelector('.ok').addEventListener('click', ()=> {
          myModuleController.addCategory()
        });
        document.querySelector('.cancel').addEventListener('click', ()=> overlay.classList.add('closed'))
      };

      this.addCategory = function() {// закрытие всплывающего окна Добавить категорию
        let overlay = document.querySelector('.overlay');
        overlay.classList.add('closed')
      }

      this.changeFont = function() {// изменения шрифта во вкладке расходы в селекте для пункта "Выбрать", т к для остальных options нужен класс fa
        if (document.querySelector('select').value === "choose-category") {
          document.querySelector('select').classList.remove('fa');
        } else {
          document.querySelector('select').classList.add('fa');
        }
      }

      this.showCur = function(a, b, c) { // добавление значения крусов в виджет на сегодня 
        let usd = document.querySelector('#USD');
        let eur = document.querySelector('#EUR');
        let rub = document.querySelector('#RUB');
        usd.innerHTML = a;
        eur.innerHTML = b;
        rub.innerHTML = c;
      }

      this.drawTable = function(p,year,month,day) {// отрисовка таблицы с расходами за день
        let div = document.getElementById('table-with-day-info');
        div.innerHTML =p;
        myModuleController.addEventsToTable(year,month,day)
      }

      this.editTable = function(el, year,month,day,changeCat){ // внесение изменений пользователем в таблицу с расходами за день
        let td = el.parentElement.previousElementSibling;
        let sum = document.getElementById('sum');
        let initialSum = sum.innerHTML;
        let currentVal = td.innerHTML;
        let difference = 0;
        td.innerHTML='';
        let newInput = document.createElement('input');
        newInput.value = currentVal;
        newInput.type ='number';
        newInput.focus();
        newInput.value = currentVal;
        td.append(newInput);

        newInput.onblur = function() {
          newInput.value = newInput.value === '' ? currentVal : newInput.value;
          td.innerHTML = newInput.value;
          sum.innerHTML= +initialSum + +newInput.value - currentVal;
          difference = newInput.value - currentVal
          myModuleController.editOutcome(year,month,day,changeCat, newInput.value, difference);
        }
      }

      this.deleteLineInTable = function(el){ //удаение пункта из таблицы с расходами за день пользователем 
        el.closest('tr').style.display = 'none';
        let td = el.parentElement.previousElementSibling.previousElementSibling;
        let sum = document.getElementById('sum');
        let initialSum = sum.innerHTML;
        let currentVal = td.innerHTML;
        sum.innerHTML= initialSum - currentVal;
      }

      this.addContentMonthPage = function(y, selectMon, selectYear, createBtn){ // отрисовка кнопок во вкладке с информацией за месяц
        let divIn = document.querySelector(y);
        divIn.append(selectMon, selectYear, createBtn);
      }

      this.diagramPie = function (data, title, id) {// отрисовка круговой диаграммы на месяц
        anychart.onDocumentReady(function () {
          var chart = anychart.pie(data);
      
          chart.innerRadius("40%");
      
          var label = anychart.standalones.label();
          label.text(title);
          label.width("100%");
          label.height("100%");
          label.adjustFontSize(true);
          label.fontColor("#60727b");
          label.hAlign("center");
          label.vAlign("middle");
      
          // set the label as the center content
          chart.center().content(label);
      
          chart.container(id);
          chart.draw();
        })
      }

      this.selectTabMonth = function(e) { // переключение табов внутри  вкладки с информацией за месяц
        let tabsMonth = document.querySelector('.tabs-month'),
            outMon = document.querySelectorAll('.monthInfo-page > div');
        for (let i=0; i < tabsMonth.children.length; i++) {
          tabsMonth.children[i].classList.remove('active-tabs-month');
        };
        e.target.classList.add('active-tabs-month');
        tabName2 = e.target.getAttribute('data-tab-name');
        for (let j=0; j < outMon.length; j++) {
          outMon[j].classList.remove('active-info-month');
        };
        for (let j=0; j < outMon.length; j++) {
          if(outMon[j].classList.contains(tabName2)) {
              outMon[j].classList.add('active-info-month');
          }
        };
      }

      this.addBtnsToYearTab = function(selectYear, createBtn) {// отрисовка кнопок во вкладке с информацией за год
       document.querySelector(".yearInfo-page").prepend(selectYear, createBtn)
      }

      this.drawYearChart = function() {// отрисовка диаграммы на год
        if(document.getElementById('container').children.length >0) {
          document.getElementById('container').innerHTML = ''
        }
        anychart.onDocumentReady(function () {

          // create a data set
          var data = anychart.data.set(arrHistory);
      
          // map the data
          var seriesData_1 = data.mapAs({x: 0, value: 1});
          var seriesData_2 = data.mapAs({x: 0, value: 2});
      
          // create a chart
          var chart = anychart.column();
      
          // create the first series, set the data and name
          var series1 = chart.column(seriesData_1);
          series1.name("Доходы");
      
          // configure the visual settings of the first series
          series1.normal().fill("#00cc99", 0.3);
          series1.hovered().fill("#00cc99", 0.1);
          series1.selected().fill("#00cc99", 0.5);
          series1.normal().stroke("#00cc99", 1, "10 5", "round");
          series1.hovered().stroke("#00cc99", 2, "10 5", "round");
          series1.selected().stroke("#00cc99", 4, "10 5", "round");
      
          // create the second series, set the data and name
          var series2 = chart.column(seriesData_2);
          series2.name("Расходы");
      
          // configure the visual settings of the second series
          series2.normal().fill("#0066cc", 0.3);
          series2.hovered().fill("#0066cc", 0.1);
          series2.selected().fill("#0066cc", 0.5);
          series2.normal().hatchFill("forward-diagonal", "#0066cc", 1, 15);
          series2.hovered().hatchFill("forward-diagonal", "#0066cc", 1, 15);
          series2.selected().hatchFill("forward-diagonal", "#0066cc", 1, 15);
          series2.normal().stroke("#0066cc");
          series2.hovered().stroke("#0066cc", 2);
          series2.selected().stroke("#0066cc", 4);
      
          // set the container id
          chart.container('container');
      
          // initiate drawing the chart
          chart.draw();
      });
      }

      this.setSign = function(p){ // установка знака валюты в виджете
        let signs = document.querySelectorAll(".summary-info img");
        signs.forEach(item => item.setAttribute('src', p))
      }

      this.setDataCurrentVidget = function(val, prevVal, valOut) { // отрисовка виджета актуальных расходов/доходов
        let icnVidget = document.querySelector('#inc-vidget'),
            prevIcnVidget = document.querySelector('#prevInc-vidget'),
            outVidget = document.querySelector('#out-vidget'),
            resVidget = document.querySelector('#res-vidget');
        icnVidget.innerHTML =val;
        console.log(valOut)
        prevIcnVidget.innerHTML =`+${prevVal}`;
        outVidget.innerHTML =`-${valOut}`;
        resVidget.innerHTML = `=${val + +prevVal- valOut}`
      }

      this.setDateInput = function(p) { //автоматическая установка сегодняшней даты в инпуты
        let dateInput = document.querySelector('input[type=date]');
        dateInput.value = p;
      }

      this.hideEnter =function(){ // скрыть кнопку вход, отобразить сохранить и выход
        document.getElementById('enter').classList.add('closed');
        document.getElementById('save').classList.remove('closed');
        document.getElementById('exit').classList.remove('closed');
      }

      this.exitUser = function(){ // показать кнопку вход, скрыть сохранить и выход
        document.getElementById('enter').classList.remove('closed');
        document.getElementById('save').classList.add('closed');
        document.getElementById('exit').classList.add('closed');
      }
    };


    /* -------- end view --------- */
    /* ------- begin model ------- */
    function ModuleModel () {
        let myModuleView = null;
        let mainObj = {};
        let userName;
        let ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
        let updatePassword;
        let stringName='Kashevar';
        mainObj.income = {};
        mainObj.outcome ={};
        mainObj.all ={in: 0, out: 0};
        yearIncome =null;
        yearOutcome =null;
        monthIncome = null;
        monthOutcome = null;
        dayIncome = null;
        dayOutcome = null;
        categoryIncome=null;
        categoryOutcome=null;
        numIncome = null;
        numOutcome = null,
        currentDate=new Date,
        arrHistory = [['январь'],['февраль'], ['март'], ['апрель'],['май'],['июнь'],['июль'],['август'],['сентябрь'],['октябрь'],['ноябрь'],['декабрь']],
        currentCur = "bel-rub",
        newCur = null,
        currentCurRate = 1;
        let newCurRate;
        let koef;
        let objMon ={
          'январь': '01',
          'февраль': '02',
          'март': '03',
          'апрель': '04',
          'май': '05',
          'июнь': '06',
          'июль': '07',
          'август': '08',
          'сентябрь': '09',
          'октябрь': '10',
          'ноябрь': '11',
          'декабрь': '12'
      }

      // хэш с путями валюты для установки в виджете
        let objSign = {
          "bel-rub": "./assets/RUB.svg",
          "USD": "./assets/USD.svg",
          "EUR": "./assets/EUR.svg",
          "RUB": "./assets/RUB.svg",
          "GBP": "./assets/GBP.svg",
          "UAH":"./assets/UAH.svg" 
        }

        let that = this;
  
        that.init = function(view) {
          myModuleView = view;
        }
  
        that.updateState = function() { 
          const hashPageName = window.location.hash.slice(1);
          myModuleView.renderContent(hashPageName);
        }

        that.checkLocalStorage = function(){ // проверка LocalStorage на пустоту, забор данных, если они есть
         if(localStorage.length >0) {
          let keys = Object.keys(localStorage);
          userName = keys[0];
          mainObj = JSON.parse(localStorage.getItem(keys[0]));
          that.setDataCurrentVidget();
          myModuleView.hideEnter()
         }
      }

        that.validateDate = function(year, month, day) {
          let d = new Date(year, month-1, day);
          if ((d.getFullYear() == year) && (d.getMonth() == month-1) && (d.getDate() == day)) {
            return true;
          } else {
            myModuleView.showError('<p>Введена некорректная дата!</p>');
              return false;
          }
        }

        that.validateSum = function(sum) {
          if (sum === 0 || sum > 10000) {
            myModuleView.showError('<p>Введена некорректная сумма!</p>')
            return false;
          }
          return true;
        }

        that.validateCategory = function(cat) {
          if(cat === 'choose-category') {
            myModuleView.showError('<p>Выберите категорию!</p>')
            return false;
          }
          return true;
        }

        that.enterUser = function(){ // нажатие на кнопку Вход
          myModuleView.enterUser(`<input type="text" placeholder="Введите имя" id="user-name">
          </input><button class="cancel" title="Отмена">Отмена</button><button class="ok ok2" title="OK">OK</button>`)
        }

        that.registerUser = async function(name){ //
            userName = name;
            await that.checkUser();
            that.addUserToLocalStorage()
            myModuleView.addCategory()
        }

        that.exitUser = function(){
          mainObj = {}
          mainObj.income = {};
          mainObj.outcome ={};
          mainObj.all ={in: 0, out: 0};
          that.setDataCurrentVidget();
          myModuleView.exitUser();
          that.clearLocalStorage();
        }

        that.addUserToLocalStorage =function() {
          localStorage.setItem(userName, JSON.stringify(mainObj));
        }

        that.updateIncome = function(dayIncome, monthIncome, yearIncome, categoryIncome, numIncome){ // сохраняем данные по доходам
          if (that.validateSum(numIncome) && that.validateDate(yearIncome, monthIncome, dayIncome) && that.validateCategory(categoryIncome)) {
            if ( ! (yearIncome in mainObj.income)) {
                mainObj.income[yearIncome] = {}
            };
            if(! (monthIncome in mainObj.income[yearIncome])) {
                mainObj.income[yearIncome][monthIncome] ={}
            };
            if(! (dayIncome in mainObj.income[yearIncome][monthIncome])) {
                mainObj.income[yearIncome][monthIncome][dayIncome] ={}
            };
            if(! (categoryIncome in mainObj.income[yearIncome][monthIncome][dayIncome])) {
                mainObj.income[yearIncome][monthIncome][dayIncome][categoryIncome] =0;
            }
            mainObj.income[yearIncome][monthIncome][dayIncome][categoryIncome]+= numIncome;
            mainObj.all.in += numIncome;
            that.setDataCurrentVidget()
        }
        }

        that.updateOutcome = function(dayOutcome, monthOutcome, yearOutcome, categoryOutcome, numOutcome){ // сохраняем данные по расходам
    
        if (that.validateSum(numOutcome) && that.validateDate(yearOutcome, monthOutcome, dayOutcome) && that.validateCategory(categoryOutcome)) {
            if ( ! (yearOutcome in mainObj.outcome)) {
                mainObj.outcome[yearOutcome] = {}
            };
            if(! (monthOutcome in mainObj.outcome[yearOutcome])) {
                mainObj.outcome[yearOutcome][monthOutcome] ={}
            };
            if(! (dayOutcome in mainObj.outcome[yearOutcome][monthOutcome])) {
                mainObj.outcome[yearOutcome][monthOutcome][dayOutcome] ={}
            };
            if(! (categoryOutcome in mainObj.outcome[yearOutcome][monthOutcome][dayOutcome])) {
                mainObj.outcome[yearOutcome][monthOutcome][dayOutcome][categoryOutcome] =0;
            }
            mainObj.outcome[yearOutcome][monthOutcome][dayOutcome][categoryOutcome]+= numOutcome;
            mainObj.all.out += numOutcome;

            that.setDataCurrentVidget()
        }
        }

        that.showAddCategory = function() {  // открыть модальное окно, где можно добавить категорию
          myModuleView.showAddCategory(`<input type="text" placeholder="Добавьте категорию" id="add-cat">
          </input><button class="cancel" title="Отмена">Отмена</button><button class="ok ok2" title="OK">OK</button>`)
        }
    
        that.addCategory = function(newCat) {  // добавление категории
          let a = document.querySelector('select').innerHTML;
          if(newCat != "") document.querySelector('select').innerHTML = `${a}<option>${newCat}</option>`;
          myModuleView.addCategory()
        }

        that.changeFont= function() { // изменения шрифта во вкладке расходы в селекте для пункта "Выбрать"
          myModuleView.changeFont()
        }

        that.showCur = function() {// отрисовать виджет с курсами на сегодня
          let apiUrl = "https://www.nbrb.by/api/exrates/rates?periodicity=0";
         fetch(apiUrl)
          .then(response => response.json())
          .then(data =>{
              let a = Math.round(data.filter(elem => elem['Cur_Abbreviation'] === 'USD')[0]['Cur_OfficialRate']*100)/100;
              let b = Math.round(data.filter(elem => elem['Cur_Abbreviation'] === 'EUR')[0]['Cur_OfficialRate']*100)/100;
              let c = Math.round(data.filter(elem => elem['Cur_Abbreviation'] === 'RUB')[0]['Cur_OfficialRate']*100)/100;
              myModuleView.showCur(a, b, c);
          })
        .catch(error => console.error("Ошибка. Причина: " + error));
        }

        that.drawTable = function(year, month, day) {// подготовка innerHTMI для отрисовки таблицы с расходами за день
          let table = `<table><col class="col1"><col class="coln"><col class="col2">`,
              searchInfo = null,
              inner = null,
              sum = 0;
          if (that.validateDate(year, month, day)) {
            if (year in mainObj.outcome) { 
                if (month in mainObj.outcome[year]) {
                    if( day in mainObj.outcome[year][month]) {
                        searchInfo = mainObj.outcome[year][month][day];
                        for (let key in searchInfo){
                            sum+=searchInfo[key];
                            table += `<tr><td>${key}</td><td class="change-table">${Math.round(searchInfo[key])}</td><td><i class="fas fa-pencil-alt" title="Исправить"></i></td><td><i class="fas fa-trash-alt" title="Удалить"></i></td>`
                        }
                        table +=`<tr><td>Итого </td><td id ="sum" colspan="3">${Math.round(sum)}</td></tr></table>`;
                        inner = table
                    } else {
                      inner = "На выбранную дату нет сведений"
                    }
                } else {
                  inner = "На выбранную дату нет сведений"
                }
            } else {
              inner = "На выбранную дату нет сведений"
            }
            myModuleView.drawTable(inner,year,month,day);
          }
        }

        that.editTable = function(el,year,month,day){ // внесение изменений пользователем в таблицу с расходами за день
            let changeCat = el.closest('tr').children[0].innerHTML;
            myModuleView.editTable(el, year,month,day,changeCat);
        }
      
        that.editOutcome = function(year,month,day,changeCat, val, diff) {// обновлене главного обекта после внесения изменений
            mainObj.outcome[year][month][day][changeCat] = +val;
            mainObj.all.out += diff;
            that.setDataCurrentVidget();
        }

        that.deleteLineInTable = function(el,year,month,day){ //удаение пункта из таблицы с расходами за день пользователем
            let changeCat= el.closest('tr').children[0].innerHTML;
            mainObj.all.out -= mainObj.outcome[year][month][day][changeCat];
            delete mainObj.outcome[year][month][day][changeCat];
            myModuleView.deleteLineInTable(el);
            that.setDataCurrentVidget();
        }

        that.addContentMonthPage = function(x, y, selectMon, selectYear, createBtn){// добавить кнопки во вкладку с информацией по месяцам
          // добавляем options в select выбор месяца
          let monArr =['выбрать месяц','январь','февраль','март','апрель','май','июнь','июль', 'август','сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
          for (let i =0; i < monArr.length; i++) {
              let month = document.createElement('option');
              month.value = monArr[i];
              month.innerHTML = monArr[i];
              selectMon.append(month);
          }

          // добавляем options в select выбор года
          let yearArr = []
          for (let k in mainObj[x]) {yearArr.push(k);}
          yearArr = yearArr.filter((item, index)=> yearArr.indexOf(item) ===index);
          yearArr.sort(function(a, b) { return a - b; });
          yearArr = ['выбрать год'].concat(yearArr);
          for (let i =0; i < yearArr.length; i++) {
              let year = document.createElement('option');
              year.value = yearArr[i];
              year.innerHTML = yearArr[i];
              selectYear.append(year);
          }
          myModuleView.addContentMonthPage(y, selectMon, selectYear, createBtn)
        }

        that.createDiagramPie = function(el, p, id, mon, year){// проверка перед отрисовкой круговой диаграмы за месяц
          if(mon === 'выбрать месяц' || year === 'выбрать год') {
            myModuleView.showError('<p>Выберите дату!</p>')
          } else {
            that.drawPie(el, id, mainObj[p][year][objMon[mon]],mon, year, objMon[mon], mainObj[p][year])
          }
        }
         
        that.drawPie = function(el, id, obj,mon, year, key, object) {// отрисовк круговой диаграмы на месяц
          if(el.parentElement.children.length>3) {
            el.parentElement.children[3].remove()
          }
          if (!(key in object)) {
              let p = document.createElement('p');
              p.innerHTML ='На выбранну дату нет сведений'
              el.parentElement.append(p);
              return;
          }
          let div = document.createElement('div');
          div.setAttribute('id', id);
          div.style.cssText=`display: block; width: 100%; height: 280px`
          let obj2 = that.sumValueByKey(obj);
          let data =[];
          for (let k in obj2) {
              data.push({value: obj2[k], x: k})
          };
          let title= `${mon} ${year}`;
          el.parentElement.append(div);
      
          myModuleView.diagramPie(data, title, id);
        }

        that.sumValueByKey = function(obj) {// считаем суммы по одинаковым ключам за месяц
          let arr=[];
          let finalObj={};
      
          for (let key in obj){
              arr.push(obj[key])
          }
      
          for (let i=0; i < arr.length; i++) {
              for (let k in arr[i]) {
              let value = arr[i][k];
                  if( finalObj[k] === undefined){
                      finalObj[k] = value;
                  }else{
                      finalObj[k] += value;
                  }
            }}
          return finalObj;
        }

        that.selectTabMonth = function(e) {
          myModuleView.selectTabMonth(e)
        }

        that.addBtnsToYearTab = function(selectYear, createBtn) { // проверка какие года заполнены пользователем, чтобы отрисовать только заполненные
          let yearArr = []
          for (let k in mainObj.income) {
            yearArr.push(k);
          }
          for (let k in mainObj.outcome) {
            yearArr.push(k);
          }
          yearArr = yearArr.filter((item, index)=> yearArr.indexOf(item) ===index);
          yearArr.sort(function(a, b) { return a - b; });
          yearArr = ['выбрать год'].concat(yearArr);
          for (let i =0; i < yearArr.length; i++) {
              let year = document.createElement('option');
              year.value = yearArr[i];
              year.innerHTML = yearArr[i];
              selectYear.append(year);
          }
          myModuleView.addBtnsToYearTab(selectYear, createBtn)
        }

        /* Подсчет всех расходов/доходов за год и представление этой информаии в виде массива, для дальнейшей передачи
        в функцию рисующую диаграмму */
        that.calcForYearChart = function(x, yearHistory){
          if( x in mainObj && yearHistory in mainObj[x]) {
            for (let i =1; i <=12; i++) {
              if (`0${i}` in mainObj[x][yearHistory]) {
                let value =0;
                for( let k in mainObj[x][yearHistory][`0${i}`]) {
                  for (let key in mainObj[x][yearHistory][`0${i}`][k]){
                     value +=mainObj[x][yearHistory][`0${i}`][k][key]
                  }
                }
                arrHistory[i-1].push(value);
              } else if (`${i}` in mainObj[x][yearHistory]) {
                let value =0;
                for( let k in mainObj[x][yearHistory][`${i}`]) {
                  for (let key in mainObj[x][yearHistory][`${i}`][k]){
                    value += mainObj[x][yearHistory][`${i}`][k][key]
                  }
                }
                  arrHistory[i-1].push(value);
              } else {
                  arrHistory[i-1].push(0);
              };
            }
          } else {
              for (let i =0; i <12; i++) {
                  arrHistory[i].push(0);
              }
          }
        }

        that.drawYearChart = function() { // передача массива для отрисовки диаграммы да год
        myModuleView.drawYearChart(arrHistory)
        }

        that.getValCur = function(p) { // установка новой валюты пользователем
          newCur = p;
        }

        that.changeCur = async function(){ // смена валюты и отображение в виджете
          await that.getNewCourses();
          koef = currentCurRate / newCurRate;
          that.setNewCourses();
          currentCur = newCur;
          that.setSign();
          that.setDataCurrentVidget();
        }
      
        that.getNewCourses = function() { // получение актуальных курсов посредством API Нац банка
          apiUrl = "https://www.nbrb.by/api/exrates/rates?periodicity=0";
          return fetch(apiUrl)
              .then(response => response.json())
              .then(data =>{
                  if( newCur != "bel-rub" && currentCur == "bel-rub") {
                      newCurRate = data.filter(elem => elem['Cur_Abbreviation'] === newCur)[0]['Cur_OfficialRate'];
                      currentCurRate =1;
                    } else if (newCur==currentCur){
                      newCurRate = currentCurRate;
                  } else if ( newCur != "bel-rub" && currentCur!= "bel-rub") {
                      newCurRate = data.filter(elem => elem['Cur_Abbreviation'] === newCur)[0]['Cur_OfficialRate'];
                      currentCurRate = data.filter(elem => elem['Cur_Abbreviation'] === currentCur)[0]['Cur_OfficialRate'];
                  } else if (newCur==currentCur){
                      newCurRate = currentCurRate;
                  } else {
                    currentCurRate = data.filter(elem => elem['Cur_Abbreviation'] === currentCur)[0]['Cur_OfficialRate'];
                    newCurRate = 1;
                  }
                  if( newCur == "RUB"|| newCur == "UAH") newCurRate /= 100;
                  if( currentCur == "RUB" || currentCur == "UAH") currentCurRate /=100;
                  console.log(currentCur, newCur, currentCurRate, newCurRate)
              })
              .catch(error => console.error("Ошибка. Причина: " + error));
        }

        that.setNewCourses = function() { // пересчет всей информации по новой валюте
          for (let k in mainObj) {
            for(let year in mainObj[k]){
                for (let mon in mainObj[k][year]) {
                    for (let date in mainObj[k][year][mon]) {
                        for (let cat in mainObj[k][year][mon][date]) {
                            mainObj[k][year][mon][date][cat] =mainObj[k][year][mon][date][cat] *koef;
                        }
                    }
                }
            }
        }
        mainObj.all.in = mainObj.all.in *koef;
        mainObj.all.out = mainObj.all.out *koef;
        }

        that.setSign = function(){
          myModuleView.setSign(objSign[currentCur])
        }

        that.setDataCurrentVidget = function() { // получение актуальных данных для отрисовки виджета доходов/ расходов
          let val = 0;
          let prevVal =0;
          let valOut =0;
          let month = (currentDate.getMonth()+1 <10) ? `0${currentDate.getMonth()+1}` : `${currentDate.getMonth()+1}`;

          if(currentDate.getFullYear() in mainObj.income) {
              if(month in mainObj.income[currentDate.getFullYear()]);
              let obj2 = that.sumValueByKey(mainObj.income[currentDate.getFullYear()][month]);
              for (let k in obj2) {val += obj2[k]};
          }

          if(currentDate.getFullYear() in mainObj.outcome) {
              if(month in mainObj.outcome[currentDate.getFullYear()]);
              let obj2 = that.sumValueByKey(mainObj.outcome[currentDate.getFullYear()][month]);
              for (let k in obj2) {valOut += obj2[k]};
          }

          val = Math.round(val);
          valOut = Math.round(valOut)
          prevVal = Math.round(mainObj.all['in']-mainObj.all['out']- val + valOut);
          myModuleView.setDataCurrentVidget(val, prevVal, valOut, month)
        }

        that.setDateInput = function() { //автоматическая установка сегодняшней даты в инпуты
          let month = (currentDate.getMonth()+1 <10) ? `0${currentDate.getMonth()+1}` : `${currentDate.getMonth()+1}`;
          let day =(currentDate.getDate() <10) ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`;
          let inputVal = `${currentDate.getFullYear()}-${month}-${day}`;
          myModuleView.setDateInput(inputVal)
        }

        that.checkUser = function(){ // чтение данных посредством AJAX запроса
          $.ajax( {
            url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
            data : { f : 'READ', n : stringName },
            success : that.readReady, error : that.errorHandler
          });
        }

        that.readReady = function(callresult) {
          if ( callresult.error!=undefined )
              console.log(callresult.error);
          else if ( callresult.result!="" ) {
              let arr=JSON.parse(callresult.result);
              let index = arr.flat().indexOf(userName);
              if(index > -1) {
                for (let i =0; i < arr.length; i++) {
                  if(arr[i][0]==userName) {
                    mainObj = arr[i][1];
                    that.setDataCurrentVidget();
                    myModuleView.hideEnter();
                    myModuleView.setSign(objSign[arr[i][2]]);
                    that.addUserToLocalStorage()
                    currentCur = arr[i][2]
                  }
                }
              }
              myModuleView.hideEnter();
          }
        }

        that.errorHandler = function(jqXHR,statusStr,errorStr){
          console.log(statusStr+' '+errorStr);
        }

        that.saveUserData = function(){
          that.updatelocalStorage()
          updatePassword=Math.random();
          $.ajax( {
              url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
              data : { f : 'LOCKGET', n : stringName, p : updatePassword },
              success : that.lockGetReady, error : that.errorHandler
          });
        }

        that.lockGetReady = function(callresult){ // перезапись данных посредством AJAX запроса
          if ( callresult.error!=undefined )
              console.log(callresult.error);
          else {
            let allUsers=JSON.parse(callresult.result);
            let index = allUsers.flat().indexOf(userName);
            if(index > -1) {
              for (let i =0; i < allUsers.length; i++) {
                if(allUsers[i][0]==userName) {
                  allUsers[i][1] = mainObj;
                  allUsers[i][2] = currentCur;
                }
              }
            } else {
                allUsers.push([userName, mainObj, currentCur]);
            }
          $.ajax( {
                  url : ajaxHandlerScript, type : 'POST', cache : false, dataType:'json',
                  data : { f : 'UPDATE', n : stringName, v : JSON.stringify(allUsers), p : updatePassword },
                  success : that.updateReady, error : that.errorHandler
              });
          }
        }

        that.updateReady = function (callresult) {
          if ( callresult.error!=undefined )
              console.log(callresult.error);
        }

        that.updatelocalStorage = function() {
          localStorage.clear()
          localStorage.setItem(userName, JSON.stringify(mainObj));
        }

        that.clearLocalStorage = function(){
          localStorage.clear()
        }
    }
  
    /* -------- end model -------- */
    /* ----- begin controller ---- */
    function ModuleController () {
        let myModuleModel = null;
        let that = this;
        let incMonth = 'выбрать месяц';
        let incYear = 'выбрать год';
        let outMonth = 'выбрать месяц';
        let outYear = 'выбрать год';
        let yearHistory = 'выбрать год';

        that.init = function(model) {
          myModuleModel = model;
  
          // вешаем слушателей на событие hashchange и кликам по пунктам меню
          window.addEventListener("hashchange", that.updateState);

          // вешаем слушателей на вход/выход/сохранени данных пользователя
          document.querySelector('#save').addEventListener("click", that.saveUserData);
          document.querySelector('#enter').addEventListener('click', that.enterUser);
          document.querySelector('#exit').addEventListener('click', that.exitUser);

          that.updateState(); //первая отрисовка
          that.showCur(); // отображение курсов валют на сегодня
          that.setSign(); //утановить знак в валюты в первом виджете
          that.checkLocalStorage()

        }
  
        that.updateState = function() { // меняем активную вкладку по клику на пункт меню
          myModuleModel.updateState();
          that.addEventToActiveTab()
        };

        that.checkLocalStorage = function(){
            myModuleModel.checkLocalStorage()
        }

        that.addEventToActiveTab = function() {// получаем кнопки и вешаем обработчики
          let saveIn = document.getElementById('save-income');
          let saveOut = document.getElementById('save-outcome');
          let addCat = document.querySelector('.add-category');
          let btnDrawTable = document.querySelector('#draw-table');
          let monthInfoPage = document.querySelector('.monthInfo-page');
          let yearInfoPage = document.querySelector('.yearInfo-page');
          let btnChangeCur = document.querySelector('#change-Cur');
          let selectCur = document.querySelector('#currency-symbol');

          if (saveIn) {
            saveIn.addEventListener('click', that.saveDataIn);
            that.setDateInput()
          }
          if (saveOut) {
            saveOut.addEventListener('click', that.saveDataOut);
            that.setDateInput();
            document.querySelector('select').addEventListener('change', ()=> that.changeFont());
          }
          if (addCat) addCat.addEventListener('click', that.showAddCategory);

          if(btnDrawTable) {
            btnDrawTable.addEventListener('click', that.drawTable);
            that.setDateInput()
          }
          if(monthInfoPage) {
            let tabsMonth = document.querySelector('.tabs-month');
            tabsMonth.addEventListener('click', that.selectTabMonth);
            that.addContentMonthPage('income', '.tab10');
            that.addContentMonthPage('outcome', '.tab11');
          }

          if(yearInfoPage) that.addBtnsToYearTab();

          if(btnChangeCur) {
            btnChangeCur.onclick = that.changeCur;
            selectCur.onchange = that.getValCur;
          }
        }

        that.enterUser =function(e){ // нажатие на кнопку Вход
          e.preventDefault();
          myModuleModel.enterUser();
        }

        that.registerUser =function(){ // внесение имени пользователя
          let userName = document.querySelector('#user-name').value;
          myModuleModel.registerUser(userName );
        }

        that.exitUser = function(){ // выход пользователя
          myModuleModel.exitUser();
        }

        that.saveDataIn = function(e){ // сохраняем данные по доходам
          e.preventDefault();
          let fullDate = document.querySelector('#date-income').value,
              categoryIncome= document.querySelector('#categories-income').value,
              numIncome=+document.querySelector('#num-income').value,
              yearIncome = fullDate.slice(0,4),
              monthIncome = fullDate.slice(5,7),
              dayIncome = fullDate.slice(8);
          myModuleModel.updateIncome(dayIncome, monthIncome, yearIncome, categoryIncome, numIncome);
        };

        that.saveDataOut = function(e){ // сохраняем данные по расходам
          e.preventDefault();
          let fullDate = document.querySelector('#date-outcome').value,
              categoryOutcome= document.querySelector('#categories-outcome').value,
              numOutcome=+document.querySelector('#num-outcome').value,
              yearOutcome = fullDate.slice(0,4),
              monthOutcome = fullDate.slice(5,7),
              dayOutcome = fullDate.slice(8);
          myModuleModel.updateOutcome(dayOutcome, monthOutcome, yearOutcome, categoryOutcome, numOutcome);
        };

        that.showAddCategory =function(e) { // открыть модальное окно, где можно добавить категорию
          e.preventDefault();
          myModuleModel.showAddCategory();
        }

        that.addCategory= function() { // добавить категорию
          let newCat = document.querySelector('#add-cat').value;
          myModuleModel.addCategory(newCat);
        }

        that.changeFont = function(){// изменения шрифта во вкладке расходы в селекте для пункта "Выбрать"
          myModuleModel.changeFont();
        }

        that.showCur = function() { // отрисовать виджет с курсами на сегодня
          myModuleModel.showCur();
        }

        that.drawTable =function(event) {
          event.preventDefault();
          let date = document.querySelector('#day-date').value,
              year = date.slice(0,4),
              month = date.slice(5,7),
              day = date.slice(8);
          myModuleModel.drawTable(year, month, day);
        }

        that.addEventsToTable = function(year,month,day) { // получаем кнопки в таблице расходов за день, вешае обработчики
          let div = document.getElementById('table-with-day-info');
          div.addEventListener('click', (e)=> {
            if(e.target.classList.contains('fa-pencil-alt')) {
              myModuleModel.editTable(e.target, year,month,day);
            } else if(e.target.classList.contains('fa-trash-alt')){
              myModuleModel.deleteLineInTable(e.target, year,month,day);
            }
          })
        }

        that.editOutcome = function(year,month,day,changeCat, val, diff) {
          myModuleModel.editOutcome(year,month,day,changeCat, val, diff)
        }

        that.addContentMonthPage = function(x, y){ // добавить кнопки во вкладку с информацией по месяцам
          let selectMon,
              selectYear,
              createBtn

            // создаём select выбор месяца
            selectMon = document.createElement('select');
            selectMon.onchange = that.getVal;

            // создаём select выбор года
            selectYear = document.createElement('select');
            selectYear.onchange = that.getVal;

            // создаем кнопку 'создать' с функцией по клику
            createBtn = document.createElement('button');
            createBtn.innerHTML = 'OK';
            createBtn.classList.add('ok');
            createBtn.classList.add('elem');
            createBtn.onclick = that.createDiagramPie;

          myModuleModel.addContentMonthPage(x, y, selectMon, selectYear, createBtn )
        }

        that.getVal = function(e) { // выбор месяца и года во вкладке информации за месяц
          if (e.target == document.querySelector('.tab10').children[0]) {
            incMonth = e.target.value;
          } else if (e.target == document.querySelector('.tab10').children[1]) {
            incYear = e.target.value;
          } else if (e.target == document.querySelector('.tab11').children[0]) {
            outMonth = e.target.value;
          } else if (e.target == document.querySelector('.tab11').children[1]) {
            outYear = e.target.value;
          }
        }

        that.createDiagramPie = function(e){
          e.preventDefault();
          let el = e.target;
          if (e.target.parentElement == document.querySelector('.tab10')) {
            myModuleModel.createDiagramPie(el,'income', 'cont1', incMonth, incYear)
          } else if (e.target.parentElement == document.querySelector('.tab11')) {
            myModuleModel.createDiagramPie(el, 'outcome', 'cont2', outMonth, outYear)
          }
        }

        that.selectTabMonth = function(e) {
          myModuleModel.selectTabMonth(e)
        }

        that.addBtnsToYearTab = function() {
          // создаём select выбор года
          let selectYear = document.createElement('select');
          selectYear.onchange = that.getVal2;

          // создаем кнопку 'создать' с функцией по клику
          let createBtn  = document.createElement('button');
          createBtn.innerHTML = 'OK';
          createBtn.classList.add('ok');
          createBtn.classList.add('elem');
          createBtn.onclick = that.drawYearChart;
          myModuleModel.addBtnsToYearTab(selectYear, createBtn)
        }

        that.getVal2 = function(e) { //выбор года во вкладке информации за год
          yearHistory = e.target.value;
        }

        that.drawYearChart = function() {
          myModuleModel.calcForYearChart('income', yearHistory);
          myModuleModel.calcForYearChart('outcome', yearHistory);
          myModuleModel.drawYearChart();
        }

        that.getValCur = function(e) {
          myModuleModel.getValCur(e.target.value);
        }

        that.changeCur = function(){ // смена валюты
          myModuleModel.changeCur()
        }

        that.setSign = function() { 
          myModuleModel.setSign()
        }

        that.setDateInput = function() {//автоматическая установка сегодняшней даты в инпуты
          myModuleModel.setDateInput()
        }

        that.saveUserData = function(){
          myModuleModel.saveUserData()
        }
      }

    
    /* ------ end controller ----- */
  
    return {
        init: function(container, routes, components) {
            this.renderComponents(container, components);
  
            const view = new ModuleView();
            const model = new ModuleModel();
            const controller = new ModuleController();
  
            //связываем части модуля
            view.init(document.getElementById(container), controller, routes);
            model.init(view);
            controller.init(model);
        },
  
        renderComponents: function (container, components) {
          const root = document.getElementById(container);
          for (let item in components) {
            if (components.hasOwnProperty(item)) {
                root.innerHTML += components[item].render();
            }
          }
        },
    };
  
  }());
  /* ------ end app module ----- */
  
  /*** --- init module --- ***/
  mySPA.init("spa", routes, components);