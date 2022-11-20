import {secondsToString} from './ui-helpers/time';

export default function TokenDetailsFixedSupply(props) {
  const tokenInfo = props.tokenInfo;
  const tokenRaddress = false;

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
        <div className="col-md-12">
          <table className="table" style={{marginBottom: 0}}>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <strong style={{float: 'left', paddingBottom: '5px'}}>Description</strong>
                  <p style={{float: 'right', margin: '0 0 5px', wordBreak: 'break-all'}}>{tokenInfo.description}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div> 
        <div className="col-md-6">
          <table className="table">
            <tbody>
              <tr>
                <td><strong>Supply</strong></td>
                <td className="text-right text-muted">{tokenInfo.hasOwnProperty('currentSupply') ? !tokenInfo.currentSupply ? 'burned' : tokenInfo.currentSupply : tokenInfo.supply}</td>
              </tr>
              <tr>
                <td><strong>Creator</strong></td>
                <td className="text-right text-muted">
                  <a href="{{$root.formatUrl('/address/' + tokenInfo.ownerAddress)}}">{tokenRaddress && tokenInfo.ownerRaddress ? tokenInfo.ownerRaddress : tokenInfo.ownerAddress}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <table className="table" style={{tableLayout: 'fixed'}}>
            <tbody>
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
        </div>
      </div>
    </>
  );
}