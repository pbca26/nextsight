import Settings from './settings';
import React, { useState, useEffect } from 'react';
import fetchWrapper from './ui-helpers/fetch';
import serverUrl from '../helpers/endpoint';

export default function Header({}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getStatus() {
    const url = `${serverUrl}/status`;
    const status = await fetchWrapper(url);

    setData({
      percentage: status.current * 100 / status.tip,
      ...status,
    });
    setIsLoading(false);
  }

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <>
      <div className="container">
        <div data-ng-controller="HeaderController">
          <div id="nav-bar" className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse" data-ng-click="$root.isCollapsed = !$root.isCollapsed">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className="navbar-collapse collapse" collapse="$root.isCollapsed">
            <ul className="nav navbar-nav">
              <li data-ng-className="{active: location.path().indexOf(item.link) > -1}">
                <a href="/" className="top-logo"><img src="/tokel.png" alt="Logo" /></a>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li>
                {!isLoading &&
                  <div className="status hidden-md" data-ng-controller="StatusController">
                    <div data-ng-init="getSync()" className="pull-left">
                      {!data &&
                        <span className="t text-danger" data-ng-show="sync.error" tooltip="{sync.error}" tooltip-placement="bottom"> 
                          <span  className="glyphicon glyphicon-warning-sign"></span>
                          ERROR 
                        </span>
                      }
                      <span className="status-perc" tooltip="{sync.syncedBlocks} / {sync.blockChainHeight} synced. {sync.skippedBlocks || 0} skipped" tooltip-placement="bottom"> 
                        {(data && data.percentage < 100) &&
                          <span className="glyphicon glyphicon-refresh icon-rotate"></span>
                        }
                        {data.percentage < 1 ? data.percentage.toFixed(2) : data.percentage.toFixed(0)}%
                      </span>
                      {(!data || data.percentage >= 100) &&
                        <span className="glyphicon glyphicon-ok" tooltip="Historic sync finished" tooltip-placement="bottom"> </span>
                      }
                    </div>
                    &nbsp;
                    {/*<span data-ng-init="getStatus('Info')" data-ng-show="!sync.error">
                      <strong>{'Connections'}</strong> {info.connections}
                    </span>*/}
                    <span className="height" data-ng-show="!sync.error">
                      <strong>{'Height'}</strong> {data.current}
                    </span>
                    {!data &&
                      <span className="height" data-ng-show="sync.error">Sync error</span>
                    }
                  </div>
                }
              </li>
              <li className="dropdown dropdown-currency" data-ng-controller="CurrencyController">
                <Settings />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}