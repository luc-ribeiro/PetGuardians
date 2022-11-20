using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class ignoraracentuacao2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CorporateName",
                table: "Shelters",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                collation: "SQL_Latin1_General_CP1_CI_AI",
                oldClrType: typeof(string),
                oldType: "nvarchar(60)",
                oldMaxLength: 60,
                oldCollation: "SQL_Latin1_General_CP1_CI_AS");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CorporateName",
                table: "Shelters",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                collation: "SQL_Latin1_General_CP1_CI_AS",
                oldClrType: typeof(string),
                oldType: "nvarchar(60)",
                oldMaxLength: 60,
                oldCollation: "SQL_Latin1_General_CP1_CI_AI");
        }
    }
}
