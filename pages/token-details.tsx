import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Main from './main';
import TokenDetailsFixedSupply from './tokenDetailsFixedSupply';
import TokenDetailsNFT from './tokenDetailsNFT';
import TokenDetailsTransactions from './tokenDetailsTransactions';
import TokenDetailsRichlist from './tokenDetailsRichlist';
import TokenDetailsOrderbook from './tokenDetailsOrderbook';
import TokenDetailsTrades from './tokenDetailsTrades';
import log from '../helpers/logger';
import serverUrl from '../helpers/endpoint';

const tabs = [
  ['transactions', 'Transactions'],
  ['richlist', 'Richlist'],
  ['orderbook', 'Orderbook'],
  ['trades', 'Trades'],
];

export default function TokenDetails(props) {
  const tokenInfo = props.tokenInfo;
  
  const [activeView, setActiveView] = useState('transactions');
  const [isLoading, setIsLoading] = useState(true);

  const setActiveViewWrapper = name => {
    if (activeView !== name) setActiveView(name);
  };

  const renderTabsMenu = () => {
    const items = [];

    for (let i = 0; i < tabs.length; i++) {
      items.push(
        <>
          <a className={activeView === tabs[i][0] ? 'active' : 'inactive'} onClick={() => setActiveViewWrapper(tabs[i][0])}>{tabs[i][1]}</a>{i < tabs.length - 1 && <span className="token-view-tabs-spacer">|</span>}
        </>
      );
    }

    return items;
  }

  log('tokenInfo', tokenInfo);

  useEffect(() => {
    if (props.tokenInfo) setIsLoading(false);
  }, []);

  return (
    <>
      <Main>
        <section>
          {tokenInfo &&
            <>
              <h1>Token Overview: {tokenInfo.name}</h1>
              {isLoading &&
                <div className="text-muted">
                  <span>Loading Token Information</span>  <span className="loader-gif"></span>
                </div>
              }
              {tokenInfo.supply > 1 &&
                <TokenDetailsFixedSupply tokenInfo={tokenInfo} />
              }
              {tokenInfo.supply <= 1 &&
                <TokenDetailsNFT tokenInfo={tokenInfo} />
              }
              <div className="token-view-tabs">
                <h4>{renderTabsMenu()}</h4>
                {activeView === 'transactions' &&
                  <div>
                    <TokenDetailsTransactions tokenInfo={tokenInfo} tokenId={tokenInfo.tokenid} />
                  </div>
                }
                {activeView === 'richlist' &&
                  <div>
                    <TokenDetailsRichlist tokenId={tokenInfo.tokenid} />
                  </div>
                }
                {activeView === 'orderbook' &&
                  <div>
                    <TokenDetailsOrderbook tokenId={tokenInfo.tokenid} />
                  </div>
                }
                {activeView === 'trades' &&
                  <div>
                    <TokenDetailsTrades tokenInfo={tokenInfo} tokenId={tokenInfo.tokenid} />
                  </div>
                }
              </div>
            </>
          }
          {!tokenInfo && 
            <div className="alert alert-warning">No information available about this token.</div>
          }
        </section>
      </Main>
    </>
  );
}

export async function getServerSideProps(context) {
  const {tokenId, txid} = context.query;
  const response = await fetch(`${serverUrl}/tokens/?tokenId=${tokenId}`);
  const tokenInfo = await response.json();
  log('tokenInfo', tokenInfo)

  return {
    props: {
      tokenInfo: tokenInfo && !tokenInfo.hasOwnProperty('error') ? tokenInfo : null,
    },
  };
}