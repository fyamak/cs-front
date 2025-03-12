import { useState } from "react";

function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState<number>(initialValue);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
