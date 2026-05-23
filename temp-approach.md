### Pillar 1: Array Ko Transform Karna (Value se Status mein badalna)
Code ki pehli trick is hisse mein hai:

```java
if (efficiency[i - 1] < u) b[i] = -1;
else if (efficiency[i - 1] == u) b[i] = 0;
else b[i] = 1;
```

*   **Kyun Kiya?** Humein check karna tha ki median `u` hai ya nahi. Median ka simple rule hai: Jitne elements usse chote hain, utne hi bade hone chahiye.
*   Humne har chote element ko `-1` bol diya, aur bade ko `+1`.
*   **Fayda:** Agar kisi tukde (subarray) mein `-1` aur `+1` ki sankhya barabar hai, toh unka Sum automatic `0` ho jayega! Ab computer ko sort karke beech ka element ginnne ki zaroorat nahi hai, use bas aisi windows dhoodhni hain jiska sum `0` aaye.

### Pillar 2: Prefix Sum Ka Logic (Sum = 0 dhoodhna)
Aapne standard subarrays with sum = 0 wala swal toh dekha hi hoga, code wahi dimaag laga raha hai:

```java
prefixSum += b[i];
```

*   Agar kisi index $i$ par humara running total (prefixSum) `5` hai, aur aage chal kar kisi index $j$ par dobara total `5` ho jata hai, iska matlab kya hai? Iska matlab un dono ke beech wale dabbo ne total mein koi badlav nahi kiya, yaani **unke beech ka sum perfect 0 tha!**
*   Isiliye jab bhi humein koi purana `prefixSum` dobara milta hai, hum samajh jaate hain ki ek valid subarray mil gaya.

### Pillar 3: Sabse Bada Jadu - Parity/Length Tracking (Even vs Odd Maps)
Aap bologe: *"Bhaiya, agar hum sirf Sum = 0 dhoodhenge, toh isme toh Even length wale tukde bhi ginte mein aa jayenge (jaise `[-1, 1]` ka sum bhi 0 hai par length 2 hai). Humein toh sirf Odd length chahiye!"*

Yahan par code ne do alag Maps lagaye hain:

```java
Map<Long, Long> freqEven = new HashMap<>();
Map<Long, Long> freqOdd = new HashMap<>();
```

Iska Mathematical Rule samjho:
Subarray ki length hoti hai: $\text{Current Index} - \text{Past Index}$

*   Agar aap abhi ek Odd Index (jaise 1, 3, 5) par khade hain, aur aap kisi Even Index (jaise 0, 2, 4) wale purane prefix sum se iski jodi banate hain, toh unka difference ($\text{Odd} - \text{Even}$) hamesha ek Odd Number (length) hi aayega!
*   Usi tarah, agar aap abhi Even Index par hain, toh aapko piche sirf Odd Index wale purane prefix sum dhoodhne chahiye.

---

### Step 2: Line-by-Line Iteration & Map States

$$\text{Final Transformed Array: } b = [0, 1, -1, -1, 0, 1, 1]$$

**Initial State:**
*   `prefixSum = 0`, `count = 0`
*   `freqEven = {0 -> 1}` *(Base case: Sum 0 at virtual index 0)*
*   `freqOdd = {}`

🔹 **i = 1 (Odd Index)**
*   `prefixSum` $= 0 + b[1] = 0 + 1 = \mathbf{1}$
*   **Check:** Index is Odd $\rightarrow$ Look inside `freqEven` for key `1`. Not found ($0$ matches). $\text{count} += 0$.
*   **Map Update:** Store `1` inside `freqOdd`. `freqOdd = {1 -> 1}`

🔹 **i = 2 (Even Index)**
*   `prefixSum` $= 1 + b[2] = 1 + (-1) = \mathbf{0}$
*   **Check:** Index is Even $\rightarrow$ Look inside `freqOdd` for key `0`. Not found ($0$ matches). $\text{count} += 0$.
*   **Map Update:** Store `0` inside `freqEven`. `freqEven = {0 -> 2}`

🔹 **i = 3 (Odd Index)**
*   `prefixSum` $= 0 + b[3] = 0 + (-1) = \mathbf{-1}$
*   **Check:** Index is Odd $\rightarrow$ Look inside `freqEven` for key `-1`. Not found ($0$ matches). $\text{count} += 0$.
*   **Map Update:** Store `-1` inside `freqOdd`. `freqOdd = {1 -> 1, -1 -> 1}`

🔹 **i = 4 (Even Index)** 🎯 First Subarray Discovered
*   `prefixSum` $= -1 + b[4] = -1 + 0 = \mathbf{-1}$
*   **Check:** Index is Even $\rightarrow$ Look inside `freqOdd` for key `-1`.
*   **Match Found!** `freqOdd` contains `-1` with a frequency of `1`. *(This uncovers the standalone subarray `[4]`)*
*   $\text{count} += 1 \rightarrow \mathbf{\text{count} = 1}$
*   **Map Update:** Store `-1` inside `freqEven`. `freqEven = {0 -> 2, -1 -> 1}`

🔹 **i = 5 (Odd Index)** 🎯 Double Subarray Discovery
*   `prefixSum` $= -1 + b[5] = -1 + 1 = \mathbf{0}$
*   **Check:** Index is Odd $\rightarrow$ Look inside `freqEven` for key `0`.
*   **Match Found!** `freqEven` contains `0` with a frequency of `2`. *(This uncovers two distinct subarrays: `[1, 4, 7]` and `[5, 3, 1, 4, 7]`)*
*   $\text{count} += 2 \rightarrow \mathbf{\text{count} = 3}$
*   **Map Update:** Store `0` inside `freqOdd`. `freqOdd = {1 -> 1, -1 -> 1, 0 -> 1}`

🔹 **i = 6 (Even Index)** 🎯 Final Subarray Discovered
*   `prefixSum` $= 0 + b[6] = 0 + 1 = \mathbf{1}$
*   **Check:** Index is Even $\rightarrow$ Look inside `freqOdd` for key `1`.
*   **Match Found!** `freqOdd` contains `1` with a frequency of `1`. *(This uncovers the subarray `[3, 1, 4, 7, 7]`)*
*   $\text{count} += 1 \rightarrow \mathbf{\text{count} = 4}$
*   **Map Update:** Store `1` inside `freqEven`. `freqEven = {0 -> 2, -1 -> 1, 1 -> 1}`

🏆 **Final Calculation Metrics**
Total Discovered Valid Subarrays: **4**
