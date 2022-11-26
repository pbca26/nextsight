export default function ProgressBar({}) {
  return (
    <>
      <div className="progress progress-striped active ng-scope">
        <div className="progress-bar progress-bar-info" style={{width: '100%'}}>
          <span className="ng-scope">Loading...</span>
        </div>
      </div>
    </>
  );
}