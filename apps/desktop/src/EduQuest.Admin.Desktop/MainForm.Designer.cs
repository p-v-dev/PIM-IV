namespace EduQuest.Admin.Desktop;

partial class MainForm
{
    /// <summary>
    ///  Required designer variable.
    /// </summary>
    private System.ComponentModel.IContainer components = null;

    /// <summary>
    ///  Clean up any resources being used.
    /// </summary>
    /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        base.Dispose(disposing);
    }

    #region Windows Form Designer generated code

    /// <summary>
    ///  Required method for Designer support - do not modify
    ///  the contents of this method with the code editor.
    /// </summary>
    private void InitializeComponent()
    {
        components = new System.ComponentModel.Container();
        var toolbar = new FlowLayoutPanel { Dock = DockStyle.Top, Height = 42, Padding = new Padding(8), AutoSize = false };
        toolbar.Controls.Add(refreshButton);
        toolbar.Controls.Add(createButton);
        toolbar.Controls.Add(editButton);
        toolbar.Controls.Add(deactivateButton);
        usersGrid.Dock = DockStyle.Fill;
        errorLabel.Dock = DockStyle.Bottom;
        errorLabel.Padding = new Padding(8);
        Controls.Add(usersGrid);
        Controls.Add(errorLabel);
        Controls.Add(toolbar);
        AutoScaleMode = AutoScaleMode.Font;
        ClientSize = new Size(900, 520);
        Text = "EduQuest Admin - Usuários";
    }

    #endregion
}
