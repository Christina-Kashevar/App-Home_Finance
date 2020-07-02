const IncomePage = {
    id: "income",
    title: "Доходы",
    render: (className = "container", ...rest) => {
      return `
        <section class="${className}">
            <form action="#" method="POST">
                <input type="number" placeholder="Сумма" id ="num-income" required>
                <input type="date" id ="date-income" required>
                <select name="categories-income" id="categories-income">
                    <option value="choose-category" selected="true" disabled> --Выбрать категорию--</option>
                    <option value="Зарплата">Зарплата</option>
                    <option value="Кредит">Кредит</option>
                    <option value="Дополнительный доход">Дополнительный доход</option>
                </select>
                <button class="add-category" title="Добавить категорию"> Добавить категорию</button>
                <button class="save" id="save-income" title="Сохранить">Сохранить</button>
            </form>
        </section>
      `;
    }
  };
  
  const OutcomePage = {
    id: "outcome",
    title: "Расходы",
    render: (className = "container", ...rest) => {
      return `
        <section class="${className}">
            <form action="#" method="POST">
                <input type="number" placeholder="Сумма" id ="num-outcome" required>
                <input type="date" id ="date-outcome" required>
                <select name="categories-outcome" id="categories-outcome">
                    <option value="choose-category" selected="true" disabled>--Выбрать категорию--</option>
                    <option value="Авто" class="fa">&#xf1b9 &nbsp;Авто</option>
                    <option value="Транспорт" class="fa">&#xf207 &nbsp;Транспорт</option>
                    <option value="Коммунальные платежи" class="fa">&#xf905&nbsp; Коммунальные платежи</option>
                    <option value="Продукты" class="fa">&#xf5d1 &nbsp;Продукты</option>
                    <option value="Одежда" class="fa">&#xf553 Одежда</option>
                    <option value="Кафе" class="fa">&#xf2e7 &nbsp;&nbsp;Кафе</option>
                    <option value="Развлечения" class="fa">&#xf630&nbsp;Развлечения</option>
                    <option value="Образование" class="fa">&#xf19d&nbsp;Образование</option>
                    <option value="Домашние животные" class="fa">&#xf1b0 &nbsp;Домашние животные</option>
                    <option value="Хобби" class="fa">&#xf53f &nbsp;Хобби</option>
                    <option value="Путешествия" class="fa">&#xf5b0&nbsp;Путешествия</option>
                    <option value="Прочее" class="fa">&#xf185 &nbsp;Прочее</option>
                </select>
                <button class="add-category" title="Добавить категорию"> Добавить категорию</button>
                <button class="save" id="save-outcome" title="Сохранить">Сохранить</button>
            </form>
        </section>
      `;
    }
  };
  
  const DayPage = {
    id: "dayInfo",
    title: "Информация по дням",
    render: (className = "container", ...rest) => {
      return `
        <section class="${className}">
            <label for="day-date">Выберите дату: </label>
            <input type="date" id="day-date">
            <button class="ok" title="OK" id="draw-table">OK</button>
            <div id="table-with-day-info"></div>
        </section>`;
    }
  };
  
  const MonthPage = {
    id: "monthInfo",
    title: "Информация по месяцам",
    render: (className = "container", ...rest) => {
      return `
        <section class="${className}">
            <ul class="tabs-month ">
                <li data-tab-name="tab10" class="active-tabs-month" id="tab10">Доход</li>
                <li data-tab-name="tab11" id="tab11">Расход</li>
            </ul>
            <div class="active-info-month tab10"></div>
            <div class="tab11"></div>
        </section>`;
    }
  };

  const YearPage = {
    id: "yearInfo",
    title: "Информация за год",
    render: (className = "container", ...rest) => {
      return `
        <section class="${className}">
            
            <div id='container'></div>
        </section>`;
    }
  };

  const SettingsPage = {
    id: "settings",
    title: "Настройки",
    render: (className = "container", ...rest) => {
      return `
        <section class="${className}">
            <label for="currency-symbol">Установить валюту</label>
            <select name="currency-symbol" id="currency-symbol">
                <option value="choose-category" selected="true" disabled>--Выбрать валюту--</option>
                <option value="bel-rub">Белорусский рубль</option>
                <option value="USD">Доллар США</option>
                <option value="EUR">Евро</option>
                <option value="RUB">Российский рубль</option>
                <option value="GBP">Фунт стерлингов</option>
                <option value="UAH">Украинская гривна</option>
            </select>
            <button class="save" id='change-Cur'>Сохранить</button>
        </section>`;
    }
  };
  