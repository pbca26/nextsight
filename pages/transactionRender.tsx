import {secondsToString} from './ui-helpers/time';
import Link from 'next/link';
import log from '../helpers/logger';

const getConvertion = (num: number) => {
  return num + ' TKL';
}

export default function TransactionRender(props) {
  const tx = props.transaction;
  const tokenInfo = props.tokenInfo;
  const address = props.address;
  const tokenRaddress = true;

  log('tx', tx);
  log('tokenInfo', tokenInfo);

  return (
    <section>
      {(tx && tokenInfo) &&
        <div className="block-tx ng-scope">
          <div className="line-bot row" data-ng-hide="!tx">
            <div className="col-xs-7 col-md-8">
              <div className="ellipsis">
                <a className="btn-expand" title="Show/Hide items details" data-ng-click="itemsExpanded = !itemsExpanded">
                  <span className="glyphicon glyphicon-plus-sign" data-ng-class="{'glyphicon-minus-sign': itemsExpanded}" style={{paddingRight: '5px'}}></span>
                </a>
                <a>{tx.txid}</a>
                <span className="btn-copy" clip-copy="tx.txid"></span>
              </div>
            </div>
            <div className="col-xs-5 col-md-4 text-right text-muted">
              <div data-ng-show="tx.time">
                <span style={{paddingRight: '5px'}}>mined</span>
                <time>{secondsToString(tx.time)}</time>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div style={{height: '100px'}}>&nbsp;</div>
            </div>
            <div className="col-md-6">
              <div style={{height: '100px'}}>&nbsp;</div>
            </div>
          </div>
          <div className="row line-mid">
            <div className="col-md-5">
              <div className="row">
                <div>
                  {tx.type === 'bid' &&
                    <div className="panel panel-default">
                      <div className="panel-body transaction-vin-vout">
                        <div className="pull-right btc-value" data-ng-class="{'text-danger': $root.currentAddr == tx.from}">
                          {getConvertion(tx.order.amount.value)}
                        </div>
                        <div className="ellipsis">
                          {address !== tx.order.from &&
                            <Link href={`address?tokenId=${tokenInfo.tokenid}&address=${tx.order.from}`}><a>{tx.order.from}</a></Link>
                          }
                          {address === tx.order.from &&
                            <span className="text-muted" title="Current Token Address">{tx.order.from}</span>
                          }
                        </div>
                      </div>
                    </div>
                  }
                  {(tx.type !== 'coinbase' && tx.type !== 'bid') &&
                    <div className="panel panel-default">
                      <div className="panel-body transaction-vin-vout">
                        {tx.type !== 'coinbase' &&
                          <div className="pull-right btc-value" data-ng-class="{'text-danger': $root.currentAddr == tx.from}">
                            {tx.value} {tokenInfo.name}
                          </div>
                        }
                        <div className="ellipsis">
                          {address !== tx.from &&
                            <Link href={`address?tokenId=${tokenInfo.tokenid}&address=${tx.from}`}><a>{tx.from}</a></Link>
                          }
                          {(tokenRaddress && tx.from[0] === 'C') &&
                            <span className="c-index-info">
                              <span>?</span>
                              <div className="tooltip fade right in">
                                <div className="tooltip-arrow"></div>
                                <div className="tooltip-inner">{tx.type === 'transfer' ? 'Pre June 2022 fork address' : 'On chain DEX address'}</div>
                              </div>
                            </span>
                          }
                          {address === tx.from &&
                            <span className="text-muted" title="Current Token Address">{address}</span>
                          }
                        </div>
                      </div>
                    </div>
                  }
                  {tx.type === 'coinbase' &&
                    <div style={{padding: '10px 20px', textAlign: 'center'}}>Coinbase</div>
                  }
                </div>
              </div>
            </div>
            <div className="col-md-1">
              {/*(tokenInfo.data && tokenInfo.data.decoded && (tokenInfo.data.decoded.image || tokenInfo.data.decoded.url)) &&
                <img src={tokenInfo.data.decoded.image || tokenInfo.data.decoded.url} width="100" height="100" style={{position: 'absolute', top: '-112px', left: '-5px'}} />      
              */}
              <div className="hidden-xs hidden-sm text-center">
                <span className="lead glyphicon glyphicon-chevron-right text-muted"></span>
              </div>
              <div className="hidden-md hidden-lg text-center">
                <span className="lead glyphicon glyphicon-chevron-down text-muted"></span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div>
                  <div>
                    {tx.type === 'bid' &&
                      <div className="transaction-vin-vout panel panel-default">
                        <div className="panel-body">
                          <div className="pull-right btc-value">
                            On-chain DEX
                          </div>
                        </div>
                      </div>
                    }
                    {tx.type !== 'bid' &&
                      <div className="transaction-vin-vout panel panel-default">
                        <div className="panel-body">
                          <div className="pull-right btc-value" data-ng-class="{'text-danger': $root.currentAddr == tx.to}">
                            {tx.value} {tokenInfo.name}
                          </div>
                          <div className="ellipsis">
                            {address !== tx.to &&
                              <Link href={`address?tokenId=${tokenInfo.tokenid}&address=${tx.to}`}><a>{tx.to}</a></Link>
                            }
                            {address === tx.to &&
                              <span className="text-muted" title="Current Token Address">{address}</span>
                            }
                            {(tokenRaddress && tx.to[0] === 'C') &&
                              <span className="c-index-info">
                                <span>?</span>
                                <div className="tooltip fade right in">
                                  <div className="tooltip-arrow"></div>
                                  <div className="tooltip-inner">{tx.type === 'transfer' ? 'Pre June 2022 fork address' : 'On chain DEX address'}</div>
                                </div>
                              </span>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tx.royalty &&
            <div className="row line-mid">
              <div className="col-md-5">
                <div className="row">
                  <div>
                    <div className="panel panel-default">
                      <div className="panel-body transaction-vin-vout">
                        <div className="ellipsis">
                          <span title="Current Token Address">{tx.royalty.royaltyPercentage}% royalty</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-1">
                <div className="hidden-xs hidden-sm text-center">
                  <span className="lead glyphicon glyphicon-chevron-right text-muted"></span>
                </div>
                <div className="hidden-md hidden-lg text-center">
                  <span className="lead glyphicon glyphicon-chevron-down text-muted"></span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="row">
                  <div>
                    <div>
                      <div className="transaction-vin-vout panel panel-default">
                        <div className="panel-body">
                          <div className="pull-right btc-value" data-ng-class="{'text-danger': $root.currentAddr == tx.to}">
                            {getConvertion(tx.royalty.value)}
                          </div>
                          <div className="ellipsis">
                            <Link href={`address?tokenId=${tokenInfo.tokenid}&address=${tx.royalty.receiver.address}`}><a>{tx.royalty.receiver.address}</a></Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          <div className="line-top row">
            <div className="col-xs-12 col-sm-12 col-md-12 token-transaction-details-block">
              <div>
                <span>Transaction type</span>: {tx.type === 'coinbase' ? 'create' : tx.type}
              </div>
              {(tx.type !== 'transfer' && tx.type !== 'coinbase') &&
                <div>
                  {tx.type === 'fillask' &&
                    <div>
                      <span>Price</span>: {getConvertion(tx.price)}
                    </div>
                  }
                  {tx.type === 'fillask' &&
                    <div>
                      <span>Total paid/received</span>: {getConvertion(tx.price * tx.value)}
                    </div>
                  }
                  {(tx.type === 'bid' || tx.type === 'ask') &&
                    <div>
                      <span>Price</span>: {getConvertion(tx.order.price.value)}
                    </div>
                  }
                  {(tx.type === 'bid' || tx.type === 'ask') &&
                    <div>
                      <span>Required</span>: {tx.order.required.satoshis} ({tokenInfo.name})
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <div className="line-top row" data-ng-hide="!tx">
            <div className="col-xs-6 col-sm-4 col-md-4">
              {(!tx.isCoinBase && !isNaN(parseFloat(tx.fees))) &&
                <span className="txvalues txvalues-default"><span>Fee</span>: {getConvertion(0.00001)}</span>
              }
              {tx.burn &&
                <span className="txvalues txvalues-default"><span>Burned</span></span>
              }
            </div>
            <div className="col-xs-6 col-sm-8 col-md-8 text-right">
              {/*!tx.confirmations &&
                <span className="txvalues txvalues-danger">Unconfirmed Transaction!</span>
              */}
              <span className="txvalues txvalues-primary">{tx.value} {tokenInfo.name}</span>
            </div>
          </div>
        </div>
      }
      {(!tx || !tokenInfo) && 
        <div className="alert alert-warning">No information available about this transaction.</div>
      }
    </section>
  );
}