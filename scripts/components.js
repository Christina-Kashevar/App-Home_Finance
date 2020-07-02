const enter ={
  render: () => {
    return `
            <div id="auth">
              <button id="enter" title="Войти">Войти</button>
              <button id="save" title="Сохранить данные" class="closed">Сохранить данные</button>
              <button id="exit" title="Выйти" class="closed">Выйти</button>
            </div>`;
  }
}

const overlay = {
  render: () => {
    return `<div class="overlay closed">
                <div class="error"></div>
            </div>`;
  }
}

const NavBar = {
    render: () => {
      return `
        <nav class="mainmenu" id="mainmenu">
          <ul class="mainmenu__list tabs">
            <li><a class="mainmenu__link" href="#income">Доходы</a></li>
            <li><a class="mainmenu__link" href="#outcome">Расходы</a></li>
            <li><a class="mainmenu__link" href="#dayInfo">Отчёт за день</a></li>
            <li><a class="mainmenu__link" href="#monthInfo">Отчёт по месяцам</a></li>
            <li><a class="mainmenu__link" href="#yearInfo">История</a></li>
            <li><a class="mainmenu__link" href="#settings">Настройки</a></li>
          </ul>
        </nav>
      `;
    }
  };
  
  const Content = {
    render: () => {
      return `<div class="content" id="content"></div>`;
    }
  };

const Summary = {
    render: () => {
        return `
        <div class="summary-info">
            <p>Доход</p><p class="right plus" id="inc-vidget">0</p><img ></img>
            <p>Предыдущий баланс</p><p class="right plus" id="prevInc-vidget">+0</p><img src="/assets/RUB.svg"></img>
            <p>Расход</p><p class="right minus" id="out-vidget">-0</p><img src="/assets/RUB.svg"></img>
            <p>Текущий баланс</p><p class="right equal" id="res-vidget">=0</p><img src="/assets/RUB.svg"></img>
        </div>`;
      }
}

const Exchange ={
    render: () => {
        return `
        <div class="exhange-info">
            <p class="item">Курс валют на сегодня:</p>
            <p>Доллар</p><p class="right" id="USD">2.5</p>
            <p>Евро</p><p class="right" id="EUR">2.7</p>
            <p>Российский рубль<sup>100</sup></p><p class="right" id="RUB">0.034</p>
    </div>`
      }
}
