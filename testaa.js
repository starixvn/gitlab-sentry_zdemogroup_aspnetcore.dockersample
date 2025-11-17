
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const beginOfWeek1 = new Date(today);
  beginOfWeek1.setDate(today.getDate() - today.getDay());
  beginOfWeek1.setHours(12, 0, 0, 0);

  const endOfWeek1 = new Date(beginOfWeek1);
  endOfWeek1.setDate(beginOfWeek1.getDate() + 7);
  endOfWeek1.setHours(11, 59, 59, 999);

  const beginOfWeek2 = new Date(beginOfWeek1);
  beginOfWeek2.setDate(beginOfWeek1.getDate() + 7);
  
  const endOfWeek2 = new Date(endOfWeek1);
  endOfWeek2.setDate(endOfWeek1.getDate() + 7);
  
  console.log(`Begin of Week 1: ${beginOfWeek1}`);
  console.log(`End of Week 1: ${endOfWeek1}`);
  console.log(`Begin of Week 2: ${beginOfWeek2}`);
  console.log(`End of Week 2: ${endOfWeek2}`);
  