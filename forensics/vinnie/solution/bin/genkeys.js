if (!process.argv[2])
  throw new Error("invalid key");

const get_number_at = (n, p) => {
  return (n+"")[(n+"").length-p]
}

const cartesian = (...args) => {
    var r = [], max = args.length-1;
    function helper(arr, i) {
        for (var j=0, l=args[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(args[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}

const { solutions } = (process.argv[2] + "-")
    .split("-")
    .reduce(({ solutions, group }, block) => {
      if (group.length !== 2) {
        return { solutions, group: [...group, block] };
      }
      
      const join_group = group.join("")
      const missing_count = join_group.length - join_group.replace(/\?/g, "").length;
      const possibilities = []
      
      for (let i = 0; i < 10**missing_count; ++i) {
        let index = 1;
        const number = join_group.replace(/\?/g, () => {
          return get_number_at(i, index++);
        })

        if ((Number(number) / 11) % 1 === 0) {
          possibilities.push(number.slice(0,6)+"-"+number.slice(6));
        }
      }

      return { solutions: [...solutions, possibilities], group: [block] };
    }, { solutions: [], group: [] });

console.log(cartesian(...solutions).map(s => s.join("-")).join("\n"))
