# -*- coding: utf-8 -*-
import mcpi.minecraft as minecraft
import time

mc = minecraft.Minecraft.create(address = "localhost", port = 4711) 
myId = mc.getPlayerEntityId("MCTCH02")
pos = mc.entity.getTilePos(myId)
#赋值，让变量更加简短
x = pos.x+10
y = pos.y
z = pos.z
height = 10

def pyramid(height):
    pos = mc.entity.getTilePos(myId)
    #赋值，让变量更加简短
    x = pos.x+10
    y = pos.y
    z = pos.z
    for level in range(height):
        mc.setBlocks(x-level-1,y,z-level-1,x+level+1,y,z+level+1,24)
        if level <9:
            mc.setBlocks(x-level,y,z-level,x+level,y,z+level,0)
        y -= 1  #y=y-1
    time.sleep(3)
    
def curse(x,y,z):
    mc.postToChat("You have been cursed...")
    mc.setBlock(x,y+7,z,8)
    mc.setBlocks(x-1,y-1,z-1,x+1,y+1,z+1,20)
    time.sleep(5)
    mc.postToChat("Well, that's it. Never get close to the pyramid again")
    mc.setBlocks(x-11,y-11,z-11,x+11,y+11,z+11,0)
    
pyramid(10)

mc.setBlock(x,y-height+2,z,57)

while True:
    time.sleep(0.5)
    newPos = mc.entity.getTilePos(myId)
    if newPos.x == x and newPos.y == y-height+3 and newPos.z == z:
        curse(newPos.x,newPos.y,newPos.z)