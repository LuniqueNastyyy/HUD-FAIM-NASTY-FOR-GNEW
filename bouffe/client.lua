local hunger, thirst, drunk = 0, 0, 0

RegisterNetEvent("::{InVek#9646}::InVek:hud:updateBasics")
AddEventHandler('::{InVek#9646}::InVek:hud:updateBasics', function(basics)
    for i = 1, #basics, 1 do
        if basics[i].name == 'hunger' then
            hunger = basics[i].percent
        elseif basics[i].name == 'thirst' then
            thirst = basics[i].percent
        elseif basics[i].name == 'drunk' then
            drunk = basics[i].percent
        end
    end
end)

local isPauseMenuActive = false

RegisterNetEvent("bdv-hud:display")
AddEventHandler("bdv-hud:display", function(display)
    SendNUIMessage({
        action = display and "showHud" or "hideHud"
    })
end)


Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500)

        if IsPauseMenuActive() ~= isPauseMenuActive then
            isPauseMenuActive = IsPauseMenuActive()
            
            SendNUIMessage({
                action = isPauseMenuActive and "hideHud" or "showHud"
            })
        end
    end
end)


Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500)

        local ped = PlayerPedId()
        local coords = GetEntityCoords(ped)
        local streetA, streetB = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
        local streetName = GetStreetNameFromHashKey(streetA)
        local crossName = streetB ~= 0 and GetStreetNameFromHashKey(streetB) or ""

        SendNUIMessage({
            action = "updateHud",
            hunger = hunger,
            thirst = thirst,
            drunk = drunk,
            street = streetName,
            cross = crossName
        })
    end
end)
