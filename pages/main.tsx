import Header from './header';

const version = '0.1';
const l = {
  name: 'en',
};

export default function Main(props) {
  return (
    <>
      <div id="body">
        <div id="wrap">
          <div className="navbar navbar-default navbar-fixed-top" role='navigation'>
            <Header />
          </div>
          <section className="container">
            {props.children}
          </section>
        </div>
        <div id="footer" role="navigation">
          <div className="container">
            <div className="links m20t pull-left">
              <span className="languages" ng-show="availableLanguages.length > 0">
                [
                <a href="#"
                  ng-click="setLanguage(l.isoCode)"
                  ng-className="{'selected': defaultLanguage == l.isoCode}"
                  ng-repeat="l in availableLanguages">
                  <span ng-show="!$first"> &middot; </span> {l.name}
                </a>
                ]
              </span>
              &nbsp;
              [
              <a href="/">verify message</a>
              <span> &middot; </span>
              <a href="/">broadcast transaction</a>
              <span ng-if="$root.tokens"> &middot; </span>
              <a href="/" ng-if="$root.tokens">decode token transaction</a>
              ]
            </div>
            <a className="insight m10v pull-right" target="_blank" href="https://github.com/pbca26">nextSight <small>API v{version}</small></a>
          </div>
        </div>
      </div>
    </>
  );
}