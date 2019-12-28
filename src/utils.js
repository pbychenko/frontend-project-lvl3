const addModalButton = (description) => {
  return `<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="${description}">Show News</button>`;
  // <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  //   <div class="modal-dialog modal-lg">
  //     <div class="modal-content">
  //       ${description}
  //     </div>
  //   </div>
  // </div>`;
};

export default addModalButton;
