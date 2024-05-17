import { FormEvent } from 'react';

function SongBaseInputWidget() {
  function songBaseSubmitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form
      className="radio-plus-song-base-input-container w-full"
      onSubmit={(e) => songBaseSubmitHandler(e)}
    >
      <label htmlFor="radio-plus-song-base-input" className="block pb-2 pl-3">
        Radio origin base
      </label>
      <div className="relative w-full">
        <input
          id="radio-plus-song-base-input"
          placeholder="https://open.spotify.com/intl-de/track/0FNLM4iuEwHAb7OTSWI18p?si=e254ad26d2624f71"
          className="w-full px-5 py-2.5 bg-base-700 border rounded-full border-base-700 focus:border-base-0 focus:outline-none active:border-base-0 placeholder-base-600"
        ></input>
        <input type="submit" value="sub" />
      </div>
    </form>
  );
}

export { SongBaseInputWidget };
