namespace EduQuest.Admin.Desktop;

public static class UiTheme
{
    public static readonly Color Background = Color.FromArgb(166, 156, 243);
    public static readonly Color Primary = Color.FromArgb(118, 101, 232);
    public static readonly Color PrimaryHover = Color.FromArgb(105, 88, 220);
    public static readonly Color Accent = Color.FromArgb(238, 234, 255);
    public static readonly Color FieldBackground = Color.FromArgb(250, 249, 255);
    public static readonly Color Foreground = Color.FromArgb(41, 38, 61);
    public static readonly Color MutedForeground = Color.FromArgb(107, 114, 128);
    public static readonly Color Border = Color.FromArgb(229, 231, 235);
    public static readonly Color Error = Color.FromArgb(180, 35, 24);

    public static Font CreateFont(float size, FontStyle style = FontStyle.Regular)
    {
        try
        {
            return new Font("Geist Variable", size, style);
        }
        catch (ArgumentException)
        {
            return new Font("Segoe UI", size, style);
        }
    }

    public static void StyleForm(Form form, bool useBackground = true)
    {
        form.BackColor = useBackground ? Background : Color.White;
        form.ForeColor = Foreground;
        form.Font = CreateFont(10);
    }

    public static void StyleTextBox(TextBox textBox)
    {
        textBox.BackColor = FieldBackground;
        textBox.ForeColor = Foreground;
        textBox.BorderStyle = BorderStyle.FixedSingle;
        textBox.Font = CreateFont(10);
        textBox.Padding = new Padding(8, 5, 8, 5);
    }

    public static void StyleComboBox(ComboBox comboBox)
    {
        comboBox.BackColor = FieldBackground;
        comboBox.ForeColor = Foreground;
        comboBox.FlatStyle = FlatStyle.Flat;
        comboBox.Font = CreateFont(10);
    }

    public static void StyleButton(Button button, bool primary = true)
    {
        button.AutoSize = true;
        button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderSize = primary ? 0 : 1;
        button.FlatAppearance.BorderColor = Border;
        button.BackColor = primary ? Primary : Color.White;
        button.ForeColor = primary ? Color.White : MutedForeground;
        button.Font = CreateFont(10, FontStyle.Bold);
        button.Padding = new Padding(14, 7, 14, 7);
        button.Cursor = Cursors.Hand;
    }

    public static void StyleGrid(DataGridView grid)
    {
        grid.BackgroundColor = Color.White;
        grid.BorderStyle = BorderStyle.None;
        grid.GridColor = Border;
        grid.EnableHeadersVisualStyles = false;
        grid.ColumnHeadersDefaultCellStyle.BackColor = Primary;
        grid.ColumnHeadersDefaultCellStyle.ForeColor = Color.White;
        grid.ColumnHeadersDefaultCellStyle.Font = CreateFont(9, FontStyle.Bold);
        grid.ColumnHeadersDefaultCellStyle.Padding = new Padding(8, 6, 8, 6);
        grid.ColumnHeadersDefaultCellStyle.SelectionBackColor = PrimaryHover;
        grid.ColumnHeadersDefaultCellStyle.SelectionForeColor = Color.White;
        grid.ColumnHeadersHeight = 40;
        grid.DefaultCellStyle.BackColor = Color.White;
        grid.DefaultCellStyle.ForeColor = Foreground;
        grid.DefaultCellStyle.SelectionBackColor = Accent;
        grid.DefaultCellStyle.SelectionForeColor = Foreground;
        grid.DefaultCellStyle.Padding = new Padding(8, 5, 8, 5);
        grid.RowTemplate.Height = 36;
    }
}
