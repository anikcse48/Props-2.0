 const calculateGA = (lmpDate, deliveryDate) => {
    if (!lmpDate || !deliveryDate) return "WW/DD";

    try {
      const [lmpDay, lmpMonth, lmpYear] = lmpDate.split('/').map(Number);
      const [delDay, delMonth, delYear] = deliveryDate.split('/').map(Number);

      const lmp = new Date(lmpYear, lmpMonth - 1, lmpDay);
      const delivery = new Date(delYear, delMonth - 1, delDay);

      if (delivery < lmp) return "Invalid Dates";

      const diff = delivery - lmp;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;

      return `${weeks}W/${remainingDays}D`;
    } catch (error) {
      return "Invalid Date Format";
    }
  };