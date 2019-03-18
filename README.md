# Home Trainer
Train your models from home/remote server while you track it's progress and enjoy your coffee.

## Concept
I wanted to start learning React Native and I needed a good remote app to check on my model's training progress because I don't carry my laptop around everytime. So I'm starting development on an app that:
- Fetches current and relevant metrics (batch, epoch, loss, acc, etc.).
- Displays the remote host system load.
- *Maybe* adjusts model's params remotely.

## Approach
- Create a custom callback for Keras that extracts information from the training process (callback.py)
  - Extract acc,loss per batch and output them after finishing an epoch
  - Outputs a JSON file that is structured like this:
  ```
  {
    "epoch": int,
    "loss": float,
    "acc": float,
    "prog_loss": list<float>,
    "prog_acc": list<float>
  }
  ```
