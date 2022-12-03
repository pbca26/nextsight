import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SearchHeader({}) {
  const router = useRouter();
  const [text, setText] = useState('');

  const handleChange = e => {
    setText(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    router.push(`/search?address=${text}`);
    setText('');
  }

  return (
    <>
      <form id="search-form" role="search" onSubmit={handleSubmit}>
        <div className="form-group" data-ng-class="{'has-error': badQuery}">
          <input id="search" type="text" className="form-control" data-ng-class="{'loading': loading}" placeholder="Search token address" value={text} onChange={handleChange} focus="true" />
        </div>
        <div className="no_matching text-danger ng-hide" data-ng-show="badQuery">No matching records found!</div>
      </form>
    </>
  );
}