const currency = {
  netSymbol: 'TKL'
};

export default function Settings({}) {
  return (
    <>
      <a className="dropdown-toggle" data-toggle="dropdown" href="#">
        Settings <span className="caret"></span>
      </a>
      <ul className="dropdown-menu">
        <li className="dropdown-menu-group">
          Currency
        </li>
        <li>
          <a data-ng-click="setCurrency('USD')" data-ng-class="{active: currency.symbol == 'USD'}">USD</a>
        </li>
        <li>
          <a data-ng-click="setCurrency(currency.netSymbol)" data-ng-class="{active: currency.symbol == currency.netSymbol}">{currency.netSymbol}</a>
        </li>
        <li>
          <a data-ng-click="setCurrency('m'+currency.netSymbol)" data-ng-class="{active: currency.symbol == ('m'+currency.netSymbol)}">m{currency.netSymbol}</a>
        </li> 
        <li>
          <a data-ng-click="setCurrency('bits')" data-ng-class="{active: currency.symbol == 'bits'}">bits</a>
        </li>
        <li className="dropdown-menu-group">
          Theme
        </li>
        <li>
          <a data-ng-click="setTheme('light')">Light</a>
        </li>
        <li>
          <a data-ng-click="setTheme('dark')">Dark</a>
        </li>
      </ul>
    </>
  );
}
