import {secondsToString} from './ui-helpers/time';

export default function TokenDetailsNFT(props) {
  const tokenInfo = props.tokenInfo;
  const tokenRaddress = false;

  // TODO: nft data formatting, image test loader

  return (
    <>
      <div className="well well-sm ellipsis">
        <div className="row">
          <div className="col-md-10">
            <div>
              <strong style={{paddingRight: '5px'}}>Token ID</strong> 
              <span className="txid text-muted">
                <a href="#">{tokenInfo.tokenid}</a>
              </span>
              <span className="btn-copy" clip-copy="tokenInfo.tokenid"></span>
            </div>
          </div>
        </div>
      </div>

      <h4 style={{paddingTop: '20px'}}>Summary</h4>
      <div className="row">
        <div ng-className="{'col-md-8': imageLoading === 'success' || imageLoading === true, 'col-md-12': imageLoading === 'error'}">
          <table className="table" ng-className="{'no-bottom-margin': imageLoading === 'success' || imageLoading === true}">
            <tbody>
              <tr>
                <td colSpan={2}>
                  <strong style={{float: 'left', paddingBottom: '5px'}}>Description</strong>
                  <p style={{float: 'right', margin: '0 0 5px', wordBreak: 'break-all'}}>{tokenInfo.description}</p>
                </td>
              </tr>
              <tr>
                <td><strong>Supply</strong></td>
                <td className="text-right text-muted">{tokenInfo.hasOwnProperty('currentSupply') ? !tokenInfo.currentSupply ? 'burned' : tokenInfo.currentSupply : tokenInfo.supply}</td>
              </tr>
              <tr>
                <td><strong>Creator</strong></td>
                <td className="text-right text-muted">
                  <a href="{$root.formatUrl('/address/' + tokenInfo.ownerAddress)}">{tokenRaddress && tokenInfo.ownerRaddress ? tokenInfo.ownerRaddress : tokenInfo.ownerAddress}</a>
                </td>
              </tr>
                {tokenInfo.currentOwner &&
                <tr>
                  <td><strong>Owner</strong></td>
                  <td className="text-right text-muted">
                    <a href="{$root.formatUrl('/address/' + tokenInfo.currentOwner)}">{tokenRaddress && tokenInfo.currentOwnerRaddress ? tokenInfo.currentOwnerRaddress : tokenInfo.currentOwner}</a>
                  </td>
                </tr>
              }
              {/*<tr>
                <td><strong>Transactions</strong></td>
                <td className="text-right text-muted">{txs.length}</td>
              </tr>*/}
              <tr>
                <td><strong>Block Height</strong></td>
                <td className="text-right text-muted">{tokenInfo.height}</td>
              </tr>
              <tr>
                <td><strong>Created at</strong></td>
                <td className="text-right text-muted">{secondsToString(tokenInfo.time)}</td>
              </tr>
            </tbody>
          </table>

          {tokenInfo.data && tokenInfo.data.decoded && Object.keys(tokenInfo.data.decoded) &&
            <h4 style={{paddingTop: '20px'}}>Token Data</h4>
          }
          {tokenInfo.data && tokenInfo.data.decoded &&
            <div className="row">
              <div className="col-md-12">
                <table className="table" style={{tableLayout: 'fixed', wordBreak: 'break-all'}}>
                  <tbody>
                    {tokenInfo.data.decoded.image &&
                      <tr>
                        <td className="col-md-4"><strong>Image URL</strong></td>
                        <td className="col-md-8 text-right text-muted">{tokenInfo.data.decoded.image}</td>
                      </tr>
                    }
                    {tokenInfo.data.decoded.physical &&
                      <tr>
                        <td className="col-md-4"><strong>Is physical copy included</strong></td>
                        <td className="col-md-8 text-right text-muted">{tokenInfo.data.decoded.physical}</td>
                      </tr>
                    }
                    {tokenInfo.data.decoded.info &&
                      <tr>
                        <td className="col-md-4"><strong>Additional info</strong></td>
                        <td className="col-md-8 text-right text-muted">{tokenInfo.data.decoded.info}</td>
                      </tr>
                    }
                    {tokenInfo.data.decoded.id &&
                      <tr>
                        <td className="col-md-4"><strong>ID</strong></td>
                        <td className="col-md-8 text-right text-muted">{tokenInfo.data.decoded.id}</td>
                      </tr>
                    }
                    {tokenInfo.data.decoded.url &&
                      <tr>
                        <td className="col-md-4"><strong>URL</strong></td>
                        <td className="col-md-8 text-right text-muted"><a href={tokenInfo.data.decoded.url}>{tokenInfo.data.decoded.url}</a></td>
                      </tr>
                    }
                    {tokenInfo.data.decoded.royalty &&
                      <tr>
                        <td className="col-md-4"><strong>Royalty</strong></td>
                        <td className="col-md-8 text-right text-muted">{tokenInfo.data.decoded.royalty * 100 / 1000}%</td>
                      </tr>
                    }
                    {tokenInfo.data.decoded.arbitrary &&
                      <tr>
                        <td className="col-md-4"><strong>Arbitrary data</strong></td>
                        <td className="col-md-8 text-right text-muted">
                          {!tokenInfo.data.decoded.arbitraryFormatted &&
                            <span>{tokenInfo.data.decoded.arbitrary}</span>
                          }
                          {tokenInfo.data.decoded.arbitraryFormatted &&
                            <pre style={{textAlign: 'left'}}>{tokenInfo.data.decoded.arbitraryFormatted}</pre>
                          }
                        </td>
                      </tr>
                    }
                    {tokenInfo.data.decoded.arbitrary && tokenInfo.data.decoded.arbitraryFormatted && tokenInfo.data.decoded.arbitraryFormatted.collection_name &&
                      <tr>
                        <td className="col-md-4"><strong>Collection</strong></td>
                        <td className="col-md-8 text-right text-muted"><a href="{$root.formatUrl('tokens/search/nftArbitrary=' + tokenInfo.data.decoded.arbitraryFormatted.collection_name + '&nftArbitraryKey=collection_name')}">{tokenInfo.data.decoded.arbitraryFormatted.collection_name}</a></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
        {tokenInfo.data &&
          <div ng-hide="imageLoading === 'error'" className="col-md-4">
            {/*<div ng-if="imageLoading === true || imageLoading === 'error'" style={{width: '100%', height: '100%', border: 'solid 1px rgba(0, 0, 0, 8%)', padding: '80px 20px', textAlign: 'center'}}>
              <span ng-if="imageLoading === true">Loading image...</span>
              <span ng-if="imageLoading === 'error'">Unable to load image!</span>
            </div>*/}
            <img ng-if="imageLoading === 'success'" src={tokenInfo.data.decoded.image || tokenInfo.data.decoded.url} width="100%" height="100%" style={{border: 'solid 1px rgba(0, 0, 0, 0.08)'}} />
          </div>
        }
      </div>

      {tokenInfo.data && tokenInfo.data.decoded &&
        <>
          <h4>Raw Token Data</h4>
          <div className="row" style={{paddingBottom: '50px'}}>
            <div className="col-md-12">
              <textarea className="form-control" rows={5} required disabled style={{resize: 'none', cursor: 'default', background: '#f5f5f5', color: '#3b4044'}}>{tokenInfo.data.decodedStr}</textarea>
            </div>
          </div>
        </>
      }
    </>
  );
}