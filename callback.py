# -*- coding: utf-8 -*-

import json
import keras
import numpy as np
import pandas as pd

#Callback Class

class HomeTrainer(keras.callbacks.Callback):
  def on_train_begin(self,logs={}):
    self.metrics = list(dict())
    self.epoch_loss = list()
    self.epoch_acc = list()
    
  def on_batch_end(self,batch,logs={}):
    self.epoch_loss.append(logs.get('loss'))
    self.epoch_acc.append(logs.get('acc'))
    
  def update_app(self, epoch):
    with open('metrics.txt','a') as f:
      f.write(json.dumps(epoch))
      
  def on_epoch_end(self, epoch, logs={}):
      epoch = {
          'epoch': len(self.metrics)+1,
          'loss': logs.get('loss'),
          'acc': logs.get('acc'),
          'loss_prog': str(self.epoch_loss),
          'acc_prog': str(self.epoch_acc),
      }
      self.epoch_loss = list()
      self.epoch_acc = list()
      self.metrics.append(epoch)
      self.update_app(epoch)

def model_compile(model,optimizer,loss):
  model.compile(optimizer=optimizer,loss=loss,metrics=['acc'])
  return model

# Sample Model

(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data();

x_train = x_train/255
x_test = x_test/255

x_train = np.reshape(x_train,(x_train.shape[0],28,28,1))
x_test = np.reshape(x_test,(x_test.shape[0],28,28,1))

y_train = pd.get_dummies(y_train)
y_test = pd.get_dummies(y_test)

inpt = keras.layers.Input(x_train.shape[1:])
output = keras.layers.Conv2D(64,kernel_size=(3,3),activation="relu")(inpt)
output = keras.layers.Conv2D(32,kernel_size=(3,3),activation="relu")(output)
output = keras.layers.MaxPool2D()(output)
output = keras.layers.Dropout(0.25)(output)
output = keras.layers.Flatten()(output)
output = keras.layers.Dense(64,activation="relu")(output)
output = keras.layers.Dense(y_train.shape[1],activation="relu")(output)

model = keras.models.Model(inpt,output)
model.summary()

model = model_compile(model,"adam","categorical_crossentropy")

model.fit(x_train, y_train, batch_size=64, epochs=2, callbacks=[HomeTrainer()])