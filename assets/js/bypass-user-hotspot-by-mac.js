function generateScript(model) {
  return `/ip hotspot ip-binding add mac-address=${model.mac} type=bypassed`;
}

function updateForm(controlModel) {
  return [];
}
