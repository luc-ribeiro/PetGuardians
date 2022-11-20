using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    public partial class about : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Shelters_Slug",
                table: "Shelters");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Shelters");

            migrationBuilder.AddColumn<string>(
                name: "About",
                table: "Shelters",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "About",
                table: "Shelters");

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Shelters",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Shelters_Slug",
                table: "Shelters",
                column: "Slug",
                unique: true,
                filter: "[Slug] IS NOT NULL");
        }
    }
}
