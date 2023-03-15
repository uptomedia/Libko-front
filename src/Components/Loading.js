import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading">
      <div className="position-relative">
        <div className="over"></div>
        <div className="lds-parent">
          <div class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
