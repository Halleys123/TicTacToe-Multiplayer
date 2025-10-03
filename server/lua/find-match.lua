local p1 = redis.call("LPOP", KEYS[1]) then
    if not p1 then return nil end
local p2 = redis.call("LPOP", KEYS[1])
    if not p2 then
        redis.call("LPUSH", KEYS[1], p1)
        return nil
end
return {p1, p2}